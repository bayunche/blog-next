'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/shared/store/authStore';
import { buildBackgroundImageValue } from '@/shared/constants/backgrounds';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated());
    const isAdmin = useAuthStore(state => state.isAdmin());
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
        }
    }, [isAuthenticated, isAdmin, router]);

    if (!isAuthenticated || !isAdmin) {
        return null; // Or loading spinner
    }

    const navItems = [
        { href: '/admin', label: '仪表盘', icon: '📊' },
        { href: '/admin/articles', label: '文章管理', icon: '📝' },
        { href: '/admin/categories', label: '分类管理', icon: '📁' },
        { href: '/admin/tags', label: '标签管理', icon: '🏷️' },
    ];

    return (
        <div className="flex min-h-screen relative overflow-hidden font-sans text-gray-800">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: buildBackgroundImageValue() }}
            />
            <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm z-0" />

            {/* Admin Sidebar */}
            <aside className="w-64 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-xl z-10 border-r border-white/20">
                <div className="p-6 border-b border-gray-200/50">
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
                                    : 'hover:bg-white/50 dark:hover:bg-gray-700/50 hover:scale-105'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <div className="pt-8 mt-4 border-t border-gray-200/50">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-500 transition-colors motion-transition"
                        >
                            <span>🏠</span>
                            <span>返回前台</span>
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* Admin Content */}
            <main className="flex-1 p-8 overflow-auto z-10 relative">
                {children}
            </main>
        </div>
    );
}
