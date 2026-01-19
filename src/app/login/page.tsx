'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { FaGithub } from 'react-icons/fa';

import { authApi } from '@/shared/api/auth';
import type { User } from '@/shared/types/user';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const setLoading = useAuthStore((state) => state.setLoading);
    const loading = useAuthStore((state) => state.loading);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await authApi.login({ account: username, password });

            // Map API response to User object
            const user: User = {
                id: res.userId,
                username: res.username,
                role: res.role, // API returns role number
                email: res.email
            };

            setAuth(user, res.token);
            router.push('/admin');
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Background (reusing global or specific) */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 blur-sm"
                style={{ backgroundImage: 'url("https://api.dujin.org/bing/1920.php")' }}
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
                        {loading ? <span className="animate-spin mr-2">C</span> : 'Login'}
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
                        <button className="p-3 bg-gray-800 text-white rounded-full hover:bg-black transition-colors shadow-md">
                            <FaGithub size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
