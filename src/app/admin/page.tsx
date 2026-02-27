'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/store/authStore';
import request from '@/shared/api/request';
import type { AxiosError } from 'axios';

interface DashboardStats {
    articleCount: number;
    commentCount: number;
    viewCount: number;
}

interface MusicAdminStatus {
    hasCookie: boolean;
    cookieMasked: string;
    loggedIn: boolean;
    defaultPlaylistId: string;
    updatedAt?: string;
    error?: string;
    profile?: {
        nickname?: string;
    } | null;
}

interface MusicQrStartResult {
    key: string;
    qrimg: string;
    qrurl?: string;
}

interface MusicQrCheckResult {
    stateCode: number;
    stateMessage?: string;
}

function formatCount(n: number) {
    if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
}

function formatDate(iso?: string) {
    if (!iso) return '-';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString();
}

function getRequestErrorMessage(error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const responseMessage = axiosError?.response?.data?.message;
    return responseMessage || (axiosError as Error)?.message || '未知错误';
}

export default function AdminDashboard() {
    const user = useAuthStore(state => state.user);
    const [stats, setStats] = useState<DashboardStats>({
        articleCount: 0,
        commentCount: 0,
        viewCount: 0
    });
    const [loading, setLoading] = useState(true);

    const [musicLoading, setMusicLoading] = useState(true);
    const [musicStatus, setMusicStatus] = useState<MusicAdminStatus>({
        hasCookie: false,
        cookieMasked: '',
        loggedIn: false,
        defaultPlaylistId: '3778678'
    });
    const [cookieInput, setCookieInput] = useState('');
    const [playlistIdInput, setPlaylistIdInput] = useState('');
    const [savingConfig, setSavingConfig] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const [qrKey, setQrKey] = useState('');
    const [qrImage, setQrImage] = useState('');
    const [qrUrl, setQrUrl] = useState('');
    const [qrState, setQrState] = useState('');
    const [startingQr, setStartingQr] = useState(false);

    const loadMusicStatus = useCallback(async () => {
        const data = await request.get<unknown, MusicAdminStatus>('/music/admin/status');
        setMusicStatus(data);
        setPlaylistIdInput(String(data.defaultPlaylistId || ''));
    }, []);

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                const [summary, music] = await Promise.all([
                    request.get<unknown, DashboardStats>('/monitor/summary'),
                    request.get<unknown, MusicAdminStatus>('/music/admin/status')
                ]);

                if (active) {
                    if (summary) {
                        setStats({
                            articleCount: Number(summary.articleCount || 0),
                            commentCount: Number(summary.commentCount || 0),
                            viewCount: Number(summary.viewCount || 0)
                        });
                    }
                    if (music) {
                        setMusicStatus(music);
                        setPlaylistIdInput(String(music.defaultPlaylistId || ''));
                    }
                }
            } catch (error) {
                console.error('获取后台数据失败:', error);
            } finally {
                if (active) {
                    setLoading(false);
                    setMusicLoading(false);
                }
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    const saveCookie = async () => {
        setSavingConfig(true);
        setStatusMessage('');
        try {
            await request.put('/music/admin/config', { neteaseCookie: cookieInput.trim() });
            await loadMusicStatus();
            setCookieInput('');
            setStatusMessage('Cookie 已保存，播放接口将使用该登录态。');
        } catch (error: unknown) {
            setStatusMessage(`保存 Cookie 失败：${getRequestErrorMessage(error)}`);
        } finally {
            setSavingConfig(false);
        }
    };

    const clearCookie = async () => {
        setSavingConfig(true);
        setStatusMessage('');
        try {
            await request.post('/music/admin/cookie/clear');
            await loadMusicStatus();
            setStatusMessage('Cookie 已清空。');
        } catch (error: unknown) {
            setStatusMessage(`清空 Cookie 失败：${getRequestErrorMessage(error)}`);
        } finally {
            setSavingConfig(false);
        }
    };

    const saveDefaultPlaylist = async () => {
        const playlistId = playlistIdInput.trim();
        if (!/^\d+$/.test(playlistId)) {
            setStatusMessage('歌单 ID 必须为纯数字。');
            return;
        }
        setSavingConfig(true);
        setStatusMessage('');
        try {
            await request.put('/music/admin/config', { defaultPlaylistId: playlistId });
            await loadMusicStatus();
            setStatusMessage('默认歌单 ID 已更新，播放器首次加载将使用该歌单。');
        } catch (error: unknown) {
            setStatusMessage(`保存歌单 ID 失败：${getRequestErrorMessage(error)}`);
        } finally {
            setSavingConfig(false);
        }
    };

    const startQrLogin = async () => {
        setStartingQr(true);
        setQrState('');
        setStatusMessage('');
        try {
            const result = await request.post<unknown, MusicQrStartResult>('/music/admin/qr/start');
            setQrKey(result.key);
            setQrImage(result.qrimg);
            setQrUrl(result.qrurl || '');
            setQrState('二维码已生成，请用网易云音乐 App 扫码并确认。');
        } catch (error: unknown) {
            setQrState(`二维码生成失败：${getRequestErrorMessage(error)}`);
        } finally {
            setStartingQr(false);
        }
    };

    useEffect(() => {
        if (!qrKey) return;
        let cancelled = false;
        let pending = false;

        const checkQrState = async () => {
            if (pending || cancelled) return;
            pending = true;
            try {
                const res = await request.get<unknown, MusicQrCheckResult>('/music/admin/qr/check', {
                    params: { key: qrKey }
                });
                const code = Number(res.stateCode || 0);
                if (code === 801) {
                    setQrState('等待扫码...');
                } else if (code === 802) {
                    setQrState('已扫码，请在手机端确认登录...');
                } else if (code === 803) {
                    setQrState('扫码登录成功，Cookie 已自动写入。');
                    setQrKey('');
                    await loadMusicStatus();
                } else if (code === 800) {
                    setQrState('二维码已过期，请重新生成。');
                    setQrKey('');
                } else {
                    setQrState(res.stateMessage || '等待扫码...');
                }
            } catch (error: unknown) {
                setQrState(`扫码状态检查失败：${getRequestErrorMessage(error)}`);
            } finally {
                pending = false;
            }
        };

        checkQrState();
        const timer = setInterval(checkQrState, 3000);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [qrKey, loadMusicStatus]);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold">欢迎回来，{user?.username}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:scale-105 transition-transform text-gray-800 dark:text-gray-100">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">文章总数</h3>
                    <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
                        {loading ? '...' : formatCount(stats.articleCount)}
                    </p>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:scale-105 transition-transform text-gray-800 dark:text-gray-100">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">评论总数</h3>
                    <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-500 to-purple-400 bg-clip-text text-transparent">
                        {loading ? '...' : formatCount(stats.commentCount)}
                    </p>
                </div>
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 hover:scale-105 transition-transform text-gray-800 dark:text-gray-100">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">访问总量</h3>
                    <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                        {loading ? '...' : formatCount(stats.viewCount)}
                    </p>
                </div>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20 text-gray-800 dark:text-gray-100 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-lg font-semibold">网易云播放配置（管理员）</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${musicStatus.loggedIn ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {musicLoading ? '状态加载中...' : musicStatus.loggedIn ? '已登录（可用于版权歌曲）' : '未登录（仅匿名可播歌曲）'}
                    </span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <p>当前 Cookie：{musicStatus.hasCookie ? musicStatus.cookieMasked || '已设置' : '未设置'}</p>
                    <p>网易云昵称：{musicStatus.profile?.nickname || '-'}</p>
                    <p>默认歌单 ID：{musicStatus.defaultPlaylistId || '-'}</p>
                    <p>配置更新时间：{formatDate(musicStatus.updatedAt)}</p>
                    {musicStatus.error ? <p className="text-red-500">状态检查错误：{musicStatus.error}</p> : null}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">手动粘贴网易云 Cookie</label>
                        <textarea
                            value={cookieInput}
                            onChange={(e) => setCookieInput(e.target.value)}
                            placeholder="粘贴完整 Cookie（至少包含 MUSIC_U）"
                            className="w-full min-h-[120px] px-3 py-2 rounded-lg bg-white/70 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={saveCookie}
                                disabled={savingConfig || !cookieInput.trim()}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm disabled:opacity-50"
                            >
                                保存 Cookie
                            </button>
                            <button
                                onClick={clearCookie}
                                disabled={savingConfig}
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm hover:bg-gray-300 disabled:opacity-50"
                            >
                                清空 Cookie
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">默认播放歌单 ID</label>
                        <input
                            value={playlistIdInput}
                            onChange={(e) => setPlaylistIdInput(e.target.value)}
                            placeholder="例如：3778678"
                            className="w-full px-3 py-2 rounded-lg bg-white/70 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
                        />
                        <button
                            onClick={saveDefaultPlaylist}
                            disabled={savingConfig || !playlistIdInput.trim()}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm disabled:opacity-50"
                        >
                            保存默认歌单
                        </button>
                        <p className="text-xs text-gray-500">
                            说明：播放器首次加载时，会自动读取该歌单作为默认列表。
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-200/70 dark:border-gray-700/70 pt-4 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            onClick={startQrLogin}
                            disabled={startingQr}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm disabled:opacity-50"
                        >
                            {startingQr ? '二维码生成中...' : '扫码登录网易云（推荐）'}
                        </button>
                        {qrUrl ? (
                            <a
                                href={qrUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                在新窗口打开登录链接
                            </a>
                        ) : null}
                    </div>

                    {qrImage ? (
                        <div className="w-48 h-48 bg-white rounded-xl border border-gray-200 p-2">
                            <img src={qrImage} alt="网易云扫码登录二维码" className="w-full h-full object-contain" />
                        </div>
                    ) : null}

                    {qrState ? <p className="text-sm text-gray-600 dark:text-gray-300">{qrState}</p> : null}
                </div>

                {statusMessage ? <p className="text-sm text-gray-700 dark:text-gray-200">{statusMessage}</p> : null}
            </div>
        </div>
    );
}
