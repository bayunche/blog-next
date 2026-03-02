'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/shared/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const token = useAuthStore(state => state.token);
    const role = useAuthStore(state => state.user?.role);
    const [bootstrapAuth] = useState(() => {
        if (typeof window === 'undefined') {
            return { token: null as string | null, role: null as number | null };
        }
        try {
            const raw = localStorage.getItem('auth-storage');
            if (!raw) return { token: null as string | null, role: null as number | null };
            const parsed = JSON.parse(raw);
            const state = parsed?.state || parsed;
            return {
                token: state?.token || null,
                role: typeof state?.user?.role === 'number' ? state.user.role : null
            };
        } catch {
            return { token: null as string | null, role: null as number | null };
        }
    });
    const [hydrated, setHydrated] = useState(() => {
        const persist = useAuthStore.persist;
        return persist ? persist.hasHydrated() : true;
    });
    const router = useRouter();
    const pathname = usePathname();
    const effectiveToken = token ?? bootstrapAuth.token;
    const effectiveRole = role ?? bootstrapAuth.role;
    const canAccessAdmin = !!effectiveToken && effectiveRole === 1;

    useEffect(() => {
        const persist = useAuthStore.persist;
        if (!persist || persist.hasHydrated()) return;
        const unsub = persist.onFinishHydration(() => {
            setHydrated(true);
        });
        return () => {
            unsub();
        };
    }, []);

    useEffect(() => {
        if (hydrated && !canAccessAdmin) {
            router.replace('/login');
        }
    }, [hydrated, canAccessAdmin, router]);

    useEffect(() => {
        const handleUnauthorized = () => {
            router.replace('/login');
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [router]);

    if (!canAccessAdmin && hydrated) {
        return null;
    }

    if (!canAccessAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-500">
                正在验证登录状态...
            </div>
        );
    }

    const navItems = [
        { href: '/admin', label: '仪表盘', icon: '📊' },
        { href: '/admin/articles', label: '文章管理', icon: '📝' },
        { href: '/admin/categories', label: '分类管理', icon: '📁' },
        { href: '/admin/tags', label: '标签管理', icon: '🏷️' },
    ];

    return (
        <div className="flex min-h-screen font-sans text-gray-800 bg-slate-100 dark:bg-slate-950">

            {/* Admin Sidebar */}
            <aside className="w-64 bg-white/95 dark:bg-slate-900/95 shadow-xl border-r border-slate-200 dark:border-slate-800">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                        Sakurairo Admin
                    </h1>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all motion-transition ${pathname === item.href
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <div className="pt-8 mt-4 border-t border-slate-200 dark:border-slate-800">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:text-pink-500 transition-colors motion-transition"
                        >
                            <span>🏠</span>
                            <span>返回前台</span>
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Admin Content */}
            <main className="flex-1 p-6 lg:p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
