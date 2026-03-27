'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import {
    FaBars,
    FaDesktop,
    FaGithub,
    FaMoon,
    FaSearch,
    FaSun,
    FaTimes,
} from 'react-icons/fa';
import { SearchModal } from './SearchModal';
import { useTheme } from '@/shared/providers/ThemeProvider';
import { ThemePreference } from '@/shared/theme/theme';
import { siteLinks, siteProfile } from '@/shared/constants/siteProfile';

const navItems = [
    { name: '首页', path: siteLinks.home },
    { name: '文章', path: siteLinks.posts },
    { name: '专题', path: siteLinks.topics },
    { name: '归档', path: siteLinks.archives },
    { name: '关于', path: siteLinks.about },
    { name: '友链', path: siteLinks.friends },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [themeMenuOpen, setThemeMenuOpen] = useState(false);
    const pathname = usePathname();
    const themeMenuRef = useRef<HTMLDivElement | null>(null);
    const { preference, resolvedTheme, setPreference } = useTheme();

    const closeMobileMenu = useEffectEvent(() => {
        setMobileMenuOpen(false);
    });
    const closeThemeMenu = useEffectEvent(() => {
        setThemeMenuOpen(false);
    });

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setSearchOpen(true);
                return;
            }

            if (event.key === 'Escape') {
                setThemeMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        closeMobileMenu();
        closeThemeMenu();
    }, [pathname]);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (!themeMenuOpen) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (!themeMenuRef.current?.contains(event.target as Node)) {
                setThemeMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        return () => document.removeEventListener('mousedown', handlePointerDown);
    }, [themeMenuOpen]);

    const closeSearch = useCallback(() => setSearchOpen(false), []);
    const githubLink = siteProfile.socialLinks[0]?.href;

    const themeOptions: Array<{
        value: ThemePreference;
        label: string;
        description: string;
        icon: typeof FaDesktop;
    }> = [
        {
            value: 'system',
            label: '跟随系统',
            description: `当前${resolvedTheme === 'dark' ? '暗黑' : '明亮'}`,
            icon: FaDesktop,
        },
        {
            value: 'light',
            label: '明亮模式',
            description: '始终使用浅色界面',
            icon: FaSun,
        },
        {
            value: 'dark',
            label: '暗黑模式',
            description: '始终使用深色界面',
            icon: FaMoon,
        },
    ];

    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/';
        }

        if (path.startsWith('/#')) {
            return pathname === '/';
        }

        return pathname?.startsWith(path);
    };

    const ThemeIcon = preference === 'system'
        ? FaDesktop
        : preference === 'light'
          ? FaSun
          : FaMoon;

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            <nav
                className={clsx(
                    'fixed left-0 right-0 top-0 z-50 transition-all motion-transition-slow',
                    scrolled
                        ? 'border-b border-gray-200/50 bg-white/88 shadow-lg backdrop-blur-xl dark:border-gray-700/20 dark:bg-gray-900/90'
                        : 'bg-gradient-to-b from-black/25 via-black/10 to-transparent'
                )}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="group flex min-w-0 items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-primary/50 transition-colors group-hover:border-primary">
                            <Image
                                src={siteProfile.author.avatar}
                                alt={siteProfile.siteName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span
                            className={clsx(
                                'truncate text-lg font-bold font-serif transition-colors sm:text-xl',
                                scrolled ? 'text-foreground' : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]'
                            )}
                        >
                            {siteProfile.siteName}
                        </span>
                    </Link>

                    <div className="hidden items-center gap-1 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={clsx(
                                    'rounded-full px-4 py-2 text-sm font-medium transition-all motion-transition',
                                    scrolled
                                        ? isActive(item.path)
                                            ? 'bg-primary text-white'
                                            : 'text-foreground hover:bg-primary/10 hover:text-primary'
                                        : isActive(item.path)
                                          ? 'bg-white/25 text-white backdrop-blur-sm'
                                          : 'text-white/90 hover:bg-white/15 hover:text-white'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative" ref={themeMenuRef}>
                            <button
                                type="button"
                                onClick={() => setThemeMenuOpen((prev) => !prev)}
                                aria-label="切换主题"
                                aria-expanded={themeMenuOpen}
                                aria-haspopup="menu"
                                className={clsx(
                                    'rounded-full p-2.5 transition-all motion-transition',
                                    scrolled
                                        ? 'text-foreground hover:bg-primary/10 hover:text-primary'
                                        : 'text-white hover:bg-white/15'
                                )}
                            >
                                <ThemeIcon size={16} />
                            </button>

                            <div
                                className={clsx(
                                    'absolute right-0 top-[calc(100%+0.75rem)] w-52 rounded-2xl border border-card-border/80 bg-card-bg/95 p-2 shadow-2xl backdrop-blur-xl transition-all motion-transition',
                                    themeMenuOpen
                                        ? 'pointer-events-auto translate-y-0 opacity-100'
                                        : 'pointer-events-none -translate-y-2 opacity-0'
                                )}
                                role="menu"
                                aria-label="主题模式"
                            >
                                {themeOptions.map(({ value, label, description, icon: OptionIcon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            setPreference(value);
                                            setThemeMenuOpen(false);
                                        }}
                                        className={clsx(
                                            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors motion-transition',
                                            preference === value
                                                ? 'bg-primary text-white'
                                                : 'text-foreground hover:bg-card-border/60 hover:text-primary'
                                        )}
                                        role="menuitemradio"
                                        aria-checked={preference === value}
                                    >
                                        <OptionIcon size={15} className="shrink-0" />
                                        <span className="min-w-0">
                                            <span className="block text-sm font-medium">{label}</span>
                                            <span
                                                className={clsx(
                                                    'block text-xs',
                                                    preference === value ? 'text-white/80' : 'text-text-muted'
                                                )}
                                            >
                                                {description}
                                            </span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setSearchOpen(true)}
                            aria-label="打开搜索"
                            className={clsx(
                                'rounded-full p-2.5 transition-all motion-transition',
                                scrolled
                                    ? 'text-foreground hover:bg-primary/10 hover:text-primary'
                                    : 'text-white hover:bg-white/15'
                            )}
                        >
                            <FaSearch size={16} />
                        </button>

                        {githubLink ? (
                            <a
                                href={githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className={clsx(
                                    'hidden rounded-full p-2.5 transition-all motion-transition md:inline-flex',
                                    scrolled
                                        ? 'text-foreground hover:bg-primary/10 hover:text-primary'
                                        : 'text-white hover:bg-white/15'
                                )}
                            >
                                <FaGithub size={16} />
                            </a>
                        ) : null}

                        <button
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            aria-label="切换菜单"
                            className={clsx(
                                'rounded-full p-2.5 transition-all motion-transition md:hidden',
                                scrolled
                                    ? 'text-foreground hover:bg-primary/10'
                                    : 'text-white hover:bg-white/15'
                            )}
                        >
                            {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                        </button>
                    </div>
                </div>
            </nav>

            <div
                className={clsx(
                    'fixed inset-0 z-40 transition-all motion-transition-slow md:hidden',
                    mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                )}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

                <div
                    className={clsx(
                        'absolute right-0 top-0 h-full w-72 bg-card-bg/95 shadow-2xl backdrop-blur-xl transition-transform motion-transition-slow',
                        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    )}
                    style={{ width: 'min(20rem, calc(100vw - 1rem))' }}
                >
                    <div className="flex h-full flex-col overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-20 sm:px-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={clsx(
                                    'border-b border-card-border py-4 text-lg font-medium transition-colors',
                                    isActive(item.path) ? 'text-primary' : 'text-foreground hover:text-primary'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="mt-8 rounded-2xl border border-card-border/80 bg-background/45 p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-subtle">
                                主题
                            </p>
                            <div className="mt-3 grid gap-2">
                                {themeOptions.map(({ value, label, description, icon: OptionIcon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            setPreference(value);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={clsx(
                                            'flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors motion-transition',
                                            preference === value
                                                ? 'bg-primary text-white'
                                                : 'bg-card-border/60 text-foreground hover:text-primary'
                                        )}
                                    >
                                        <OptionIcon size={17} className="shrink-0" />
                                        <span className="min-w-0">
                                            <span className="block text-sm font-medium">{label}</span>
                                            <span
                                                className={clsx(
                                                    'block text-xs',
                                                    preference === value ? 'text-white/80' : 'text-text-muted'
                                                )}
                                            >
                                                {description}
                                            </span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4 border-t border-card-border pt-4">
                            {githubLink ? (
                                <a
                                    href={githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-card-border p-3 transition-colors hover:bg-primary hover:text-white"
                                >
                                    <FaGithub size={20} />
                                </a>
                            ) : null}
                            <button
                                onClick={() => {
                                    setSearchOpen(true);
                                    setMobileMenuOpen(false);
                                }}
                                className="rounded-full bg-card-border p-3 transition-colors hover:bg-primary hover:text-white"
                            >
                                <FaSearch size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <SearchModal isOpen={searchOpen} onClose={closeSearch} />
        </>
    );
}
