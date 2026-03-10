'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { FaGithub } from 'react-icons/fa';
import { message } from 'antd';

import { authApi, type GithubOAuthConfigResponse } from '@/shared/api/auth';
import { encryptPassword } from '@/shared/utils/password';
import type { User } from '@/shared/types/user';
import { LOCAL_BACKGROUND_IMAGE, getRandomBackgroundSource } from '@/shared/constants/backgrounds';

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '';
const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || '';

const isPlaceholderValue = (value: string) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return true;
    if (/^\$\{.+\}$/.test(normalized)) return true;
    return normalized.includes('your_') || normalized.includes('iv1.your');
};

const createOAuthState = () => {
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }
    return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const GITHUB_OAUTH_CODE_KEY = 'github_oauth_last_code';

const clearOAuthParamsFromUrl = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    ['code', 'state', 'error', 'error_description'].forEach((key) => {
        url.searchParams.delete(key);
    });
    const next = `${url.pathname}${url.searchParams.toString() ? `?${url.searchParams.toString()}` : ''}`;
    window.history.replaceState({}, '', next);
};

const extractApiErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object') {
        const maybeError = error as { response?: { data?: { message?: string } } };
        const message = maybeError.response?.data?.message;
        if (message) return message;
    }
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return fallback;
};

function LoginContent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [backgroundImage, setBackgroundImage] = useState(LOCAL_BACKGROUND_IMAGE);
    const [githubConfig, setGithubConfig] = useState<GithubOAuthConfigResponse>({
        enabled: !isPlaceholderValue(GITHUB_CLIENT_ID),
        clientId: GITHUB_CLIENT_ID.trim(),
        redirectUri: GITHUB_REDIRECT_URI.trim(),
    });
    const githubCodeHandled = useRef<string>('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setLoading = useAuthStore((state) => state.setLoading);
    const loading = useAuthStore((state) => state.loading);
    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.user?.role);

    useEffect(() => {
        if (token && role === 1) {
            router.replace('/admin');
        }
    }, [token, role, router]);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            setBackgroundImage(getRandomBackgroundSource());
        });
        return () => window.cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        let cancelled = false;
        const loadGithubConfig = async () => {
            try {
                const config = await authApi.getGithubOAuthConfig();
                if (cancelled) return;
                const normalizedClientId = String(config.clientId || '').trim();
                const normalizedRedirectUri = String(config.redirectUri || '').trim();
                setGithubConfig({
                    enabled: !!normalizedClientId,
                    clientId: normalizedClientId,
                    redirectUri: normalizedRedirectUri,
                });
            } catch {
                if (cancelled) return;
                setGithubConfig({
                    enabled: !isPlaceholderValue(GITHUB_CLIENT_ID),
                    clientId: GITHUB_CLIENT_ID.trim(),
                    redirectUri: GITHUB_REDIRECT_URI.trim(),
                });
            }
        };
        loadGithubConfig();
        return () => {
            cancelled = true;
        };
    }, []);

    const resolveGithubOAuthParams = useCallback(() => {
        const clientId = githubConfig.clientId.trim();
        const redirectUri = githubConfig.redirectUri.trim() || `${window.location.origin}/api/conn/github/callback`;
        return { clientId, redirectUri };
    }, [githubConfig.clientId, githubConfig.redirectUri]);

    const handleGithubLogin = () => {
        const { clientId, redirectUri } = resolveGithubOAuthParams();
        if (!clientId || isPlaceholderValue(clientId)) {
            message.error('GitHub 登录尚未配置，请先设置后端 GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET。');
            return;
        }

        const state = createOAuthState();
        sessionStorage.setItem('github_oauth_state', state);
        sessionStorage.removeItem(GITHUB_OAUTH_CODE_KEY);

        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: 'read:user user:email',
            state
        });
        window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
    };

    const loginWithCode = useCallback(async (code: string, state?: string) => {
        setLoading(true);
        try {
            const expectedState = sessionStorage.getItem('github_oauth_state');
            if (expectedState && state && expectedState !== state) {
                throw new Error('GitHub 登录状态校验失败，请重试。');
            }

            message.loading({ content: 'GitHub 登录中...', key: 'login' });
            const { redirectUri } = resolveGithubOAuthParams();
            const res = await authApi.githubLogin({ code, redirectUri, state });
            const user: User = {
                id: res.userId,
                username: res.username,
                role: res.role,
                email: res.email
            };
            setAuth(user, res.token);
            sessionStorage.removeItem('github_oauth_state');
            sessionStorage.removeItem(GITHUB_OAUTH_CODE_KEY);
            message.success({ content: '登录成功', key: 'login' });
            router.replace('/admin');
        } catch (err: unknown) {
            console.error(err);
            message.error({ content: extractApiErrorMessage(err, 'GitHub 登录失败'), key: 'login' });
        } finally {
            setLoading(false);
        }
    }, [resolveGithubOAuthParams, router, setAuth, setLoading]);

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const oauthError = searchParams.get('error');
        const oauthErrorDesc = searchParams.get('error_description');

        if (oauthError) {
            clearOAuthParamsFromUrl();
            message.error(oauthErrorDesc || `GitHub 授权失败: ${oauthError}`);
            return;
        }

        if (code) {
            const consumedCode = sessionStorage.getItem(GITHUB_OAUTH_CODE_KEY);
            if (consumedCode === code) return;
            if (githubCodeHandled.current === code) return;
            sessionStorage.setItem(GITHUB_OAUTH_CODE_KEY, code);
            githubCodeHandled.current = code;
            clearOAuthParamsFromUrl();
            loginWithCode(code, state || undefined);
        }
    }, [loginWithCode, searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const account = username.trim();
        const plainPassword = password.trim();

        if (!account || !plainPassword) {
            message.warning('请输入用户名和密码');
            return;
        }
        setLoading(true);

        try {
            message.loading({ content: '登录中...', key: 'login' });
            const res = await authApi.login({ account, password: encryptPassword(plainPassword) });

            const user: User = {
                id: res.userId,
                username: res.username,
                role: res.role,
                email: res.email
            };

            setAuth(user, res.token);
            message.success({ content: '登录成功', key: 'login' });
            router.replace('/admin');
        } catch (err: unknown) {
            console.error(err);
            message.error({ content: extractApiErrorMessage(err, '登录失败'), key: 'login' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 blur-sm"
                style={{ backgroundImage: `url("${backgroundImage}")` }}
            />
            <div className="absolute inset-0 bg-white/40 z-10" />

            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md z-20 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="admin"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-transform active:scale-95 shadow-md flex justify-center items-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : 'Login'}
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500 rounded">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleGithubLogin}
                            disabled={loading}
                            className="p-3 bg-gray-800 text-white rounded-full hover:bg-black transition-all hover:scale-110 active:scale-95 shadow-md disabled:opacity-50"
                            title="GitHub Login"
                        >
                            <FaGithub size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin z-20" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
