'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    FaBars,
    FaFolder,
    FaHome,
    FaNewspaper,
    FaTachometerAlt,
    FaTags,
    FaTimes,
} from 'react-icons/fa';
import { useAuthStore } from '@/shared/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.user?.role);
    const [bootstrapAuth] = useState(() => {
        if (typeof window === 'undefined') {
            return { token: null as string | null, role: null as number | null };
        }

        try {
            const raw = localStorage.getItem('auth-storage');
            if (!raw) {
                return { token: null as string | null, role: null as number | null };
            }

            const parsed = JSON.parse(raw);
            const state = parsed?.state || parsed;

            return {
                token: state?.token || null,
                role: typeof state?.user?.role === 'number' ? state.user.role : null,
            };
        } catch {
            return { token: null as string | null, role: null as number | null };
        }
    });
    const [hydrated, setHydrated] = useState(() => {
        const persist = useAuthStore.persist;
        return persist ? persist.hasHydrated() : true;
    });
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const effectiveToken = token ?? bootstrapAuth.token;
    const effectiveRole = role ?? bootstrapAuth.role;
    const canAccessAdmin = !!effectiveToken && effectiveRole === 1;

    const closeMobileNav = useEffectEvent(() => {
        setMobileNavOpen(false);
    });

    useEffect(() => {
        const persist = useAuthStore.persist;
        if (!persist || persist.hasHydrated()) {
            return;
        }

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

    useEffect(() => {
        closeMobileNav();
    }, [pathname]);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;

        if (mobileNavOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [mobileNavOpen]);

    if (!canAccessAdmin && hydrated) {
        return null;
    }

    if (!canAccessAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-500 dark:bg-slate-950">
                Checking authentication...
            </div>
        );
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: <FaTachometerAlt size={16} /> },
        { href: '/admin/articles', label: 'Articles', icon: <FaNewspaper size={16} /> },
        { href: '/admin/categories', label: 'Categories', icon: <FaFolder size={16} /> },
        { href: '/admin/tags', label: 'Tags', icon: <FaTags size={16} /> },
    ];

    const sidebarContent = (
        <>
            <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                <h1 className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent">
                    Sakurairo Admin
                </h1>
            </div>

            <nav className="space-y-2 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileNavOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all motion-transition ${
                            pathname === item.href
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}

                <div className="mt-4 border-t border-slate-200 pt-8 dark:border-slate-800">
                    <Link
                        href="/"
                        onClick={() => setMobileNavOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 transition-colors motion-transition hover:text-pink-500 dark:text-slate-300"
                    >
                        <span><FaHome size={16} /></span>
                        <span>Back to site</span>
                    </Link>
                </div>
            </nav>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-gray-800 dark:bg-slate-950">
            <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden dark:border-slate-800 dark:bg-slate-900/95">
                <div className="flex h-16 items-center justify-between px-4">
                    <button
                        type="button"
                        onClick={() => setMobileNavOpen((prev) => !prev)}
                        className="rounded-full p-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                        aria-label="Toggle admin navigation"
                    >
                        {mobileNavOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                    </button>

                    <div className="min-w-0 flex-1 px-3 text-center">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Sakurairo Admin
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="rounded-full px-3 py-1.5 text-sm font-medium text-pink-500 transition-colors hover:bg-pink-50 dark:hover:bg-slate-800"
                    >
                        Home
                    </Link>
                </div>
            </header>

            <div className="hidden min-h-screen lg:flex">
                <aside className="w-64 border-r border-slate-200 bg-white/95 shadow-xl dark:border-slate-800 dark:bg-slate-900/95">
                    {sidebarContent}
                </aside>

                <main className="min-w-0 flex-1 overflow-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>

            <div className="lg:hidden">
                <div
                    className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity ${
                        mobileNavOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                    onClick={() => setMobileNavOpen(false)}
                />

                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-[min(20rem,calc(100vw-2.5rem))] overflow-y-auto border-r border-slate-200 bg-white/95 shadow-2xl backdrop-blur transition-transform dark:border-slate-800 dark:bg-slate-900/95 ${
                        mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex min-h-full flex-col pt-4">
                        {sidebarContent}
                    </div>
                </aside>

                <main className="min-w-0 px-4 pb-6 pt-20 sm:px-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
