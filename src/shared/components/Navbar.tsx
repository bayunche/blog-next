'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { FaGithub, FaSearch, FaSun, FaMoon, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { useTheme } from '@/shared/providers/ThemeProvider';
import { SearchModal } from './SearchModal';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Global keyboard shortcut: Cmd/Ctrl + K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const openSearch = useCallback(() => setSearchOpen(true), []);
    const closeSearch = useCallback(() => setSearchOpen(false), []);

    const navItems = [
        { name: '🏠 主页', path: '/' },
        { name: '🐾 朋友们', path: '/friends' },
        { name: '📝 文章列表', path: '/posts' },
        { name: '关于/About', path: '/about' },
    ];

    return (
        <>
            <nav
                className={clsx(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
                    scrolled
                        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg border-b border-gray-200/20 dark:border-gray-700/20'
                        : 'bg-transparent'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo with avatar */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50 group-hover:border-primary transition-colors">
                                <Image
                                    src="https://avatars.githubusercontent.com/u/1?v=4"
                                    alt="Site Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className={clsx(
                                'text-xl font-bold font-serif transition-colors',
                                scrolled ? 'text-foreground' : 'text-white drop-shadow-lg'
                            )}>
                                樱落繁星
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={clsx(
                                        'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
                                        scrolled
                                            ? pathname === item.path
                                                ? 'bg-primary text-white'
                                                : 'text-foreground hover:bg-primary/10 hover:text-primary'
                                            : pathname === item.path
                                                ? 'bg-white/30 text-white backdrop-blur-sm'
                                                : 'text-white/90 hover:bg-white/20 hover:text-white'
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right side icons */}
                        <div className="flex items-center gap-2">
                            {/* Search Button */}
                            <button
                                onClick={openSearch}
                                className={clsx(
                                    'p-2.5 rounded-full transition-all duration-300',
                                    scrolled
                                        ? 'hover:bg-primary/10 text-foreground hover:text-primary'
                                        : 'hover:bg-white/20 text-white'
                                )}
                                aria-label="Search"
                            >
                                <FaSearch size={16} />
                            </button>

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={clsx(
                                    'p-2.5 rounded-full transition-all duration-300',
                                    scrolled
                                        ? 'hover:bg-primary/10 text-foreground hover:text-primary'
                                        : 'hover:bg-white/20 text-white'
                                )}
                                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            >
                                {theme === 'dark' ? <FaSun size={16} /> : <FaMoon size={16} />}
                            </button>

                            {/* GitHub Link */}
                            <a
                                href="https://github.com/mirai-mamori/Sakurairo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={clsx(
                                    'p-2.5 rounded-full transition-all duration-300 hidden md:flex',
                                    scrolled
                                        ? 'hover:bg-primary/10 text-foreground hover:text-primary'
                                        : 'hover:bg-white/20 text-white'
                                )}
                            >
                                <FaGithub size={16} />
                            </a>

                            {/* User Avatar / Login */}
                            <Link
                                href="/login"
                                className={clsx(
                                    'p-2.5 rounded-full transition-all duration-300 hidden md:flex',
                                    scrolled
                                        ? 'hover:bg-primary/10 text-foreground hover:text-primary'
                                        : 'hover:bg-white/20 text-white'
                                )}
                            >
                                <FaUser size={16} />
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                className={clsx(
                                    'p-2.5 rounded-full md:hidden transition-all duration-300',
                                    scrolled
                                        ? 'hover:bg-primary/10 text-foreground'
                                        : 'hover:bg-white/20 text-white'
                                )}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={clsx(
                    'fixed inset-0 z-40 transform transition-all duration-500 md:hidden',
                    mobileMenuOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                )}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div
                    className={clsx(
                        'absolute right-0 top-0 h-full w-72 bg-card-bg/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-500',
                        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    )}
                >
                    <div className="flex flex-col pt-20 px-6">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={clsx(
                                    'py-4 text-lg font-medium border-b border-card-border transition-all duration-300',
                                    pathname === item.path
                                        ? 'text-primary'
                                        : 'text-foreground hover:text-primary hover:pl-2'
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <div className="flex gap-4 mt-8 pt-4 border-t border-card-border">
                            <a
                                href="https://github.com/mirai-mamori/Sakurairo"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-card-border rounded-full hover:bg-primary hover:text-white transition-colors"
                            >
                                <FaGithub size={20} />
                            </a>
                            <button
                                onClick={toggleTheme}
                                className="p-3 bg-card-border rounded-full hover:bg-primary hover:text-white transition-colors"
                            >
                                {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={closeSearch} />
        </>
    );
};
