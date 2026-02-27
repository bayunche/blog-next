'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { FaGithub } from 'react-icons/fa';
import { message } from 'antd';

import { authApi } from '@/shared/api/auth';
import { encryptPassword } from '@/shared/utils/password';
import type { User } from '@/shared/types/user';
import { buildBackgroundImageValue } from '@/shared/constants/backgrounds';

// GitHub 配置（建议通过环境变量提供）
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'Iv1.your_client_id';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/login` : '';

function LoginContent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setLoading = useAuthStore((state) => state.setLoading);
    const loading = useAuthStore((state) => state.loading);

    // 处理 GitHub 登录
    const handleGithubLogin = () => {
        const githubUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
        window.location.href = githubUrl;
    };

    // 监听 URL 中的 code
    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            loginWithCode(code);
        }
    }, [searchParams]);

    const loginWithCode = async (code: string) => {
        setLoading(true);
        try {
            message.loading({ content: 'GitHub 登录中...', key: 'login' });
            const res = await authApi.githubLogin(code);
            const user: User = {
                id: res.userId,
                username: res.username,
                role: res.role,
                email: res.email
            };
            setAuth(user, res.token);
            message.success({ content: '登录成功', key: 'login' });
            router.push('/admin');
        } catch (err: any) {
            console.error(err);
            message.error({ content: err.response?.data?.message || 'GitHub 登录失败', key: 'login' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            message.warning('请输入用户名和密码');
            return;
        }
        setLoading(true);

        try {
            message.loading({ content: '登录中...', key: 'login' });
            const res = await authApi.login({ account: username, password: encryptPassword(password) });

            const user: User = {
                id: res.userId,
                username: res.username,
                role: res.role,
                email: res.email
            };

            setAuth(user, res.token);
            message.success({ content: '登录成功', key: 'login' });
            router.push('/admin');
        } catch (err: any) {
            console.error(err);
            message.error({ content: err.response?.data?.message || '登录失败', key: 'login' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 blur-sm"
                style={{ backgroundImage: buildBackgroundImageValue() }}
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
