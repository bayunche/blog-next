'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { usePathname } from 'next/navigation';
import { FaBars, FaGithub, FaMoon, FaSearch, FaSun, FaTimes } from 'react-icons/fa';
import { SearchModal } from './SearchModal';
import { useTheme } from '@/shared/providers/ThemeProvider';
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
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const closeSearch = useCallback(() => setSearchOpen(false), []);
    const githubLink = siteProfile.socialLinks[0]?.href;

    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/';
        }

        if (path.startsWith('/#')) {
            return pathname === '/';
        }

        return pathname?.startsWith(path);
    };

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <>
            <nav
                className={clsx(
                    'fixed left-0 right-0 top-0 z-50 transition-all motion-transition-slow',
                    scrolled
                        ? 'border-b border-gray-200/20 bg-white/90 shadow-lg backdrop-blur-xl dark:border-gray-700/20 dark:bg-gray-900/90'
                        : 'bg-gradient-to-b from-black/25 to-transparent'
                )}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="group flex items-center gap-3">
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
                                'text-xl font-bold font-serif transition-colors',
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

                        <button
                            onClick={toggleTheme}
                            aria-label="切换主题"
                            className={clsx(
                                'rounded-full p-2.5 transition-all motion-transition',
                                scrolled
                                    ? 'text-foreground hover:bg-primary/10 hover:text-primary'
                                    : 'text-white hover:bg-white/15'
                            )}
                        >
                            {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
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
                >
                    <div className="flex flex-col px-6 pt-20">
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

                        <div className="mt-8 flex gap-4 border-t border-card-border pt-4">
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
                                onClick={toggleTheme}
                                className="rounded-full bg-card-border p-3 transition-colors hover:bg-primary hover:text-white"
                            >
                                {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
                            </button>
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
