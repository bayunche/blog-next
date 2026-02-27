'use client';

import { useEffect, useState } from 'react';
import { FaArrowUp, FaCog, FaMoon, FaSun, FaPalette, FaCheck } from 'react-icons/fa';
import { clsx } from 'clsx';
import { useTheme, themeColors } from '@/shared/providers/ThemeProvider';

export const FloatingToolbar = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { theme, toggleTheme, colorKey, setPrimaryColor } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-3">
            {/* Settings Panel */}
            <div
                className={clsx(
                    'bg-card-bg/95 backdrop-blur-xl rounded-2xl shadow-xl border border-card-border overflow-hidden transition-all motion-transition',
                    settingsOpen ? 'opacity-100 translate-y-0 mb-2' : 'opacity-0 translate-y-4 pointer-events-none h-0'
                )}
            >
                <div className="p-4 space-y-4 min-w-[220px]">
                    <h4 className="text-sm font-bold text-text-muted">快捷设置</h4>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-card-border/50 hover:bg-primary/10 transition-colors motion-transition text-left"
                    >
                        {theme === 'dark' ? (
                            <FaSun className="text-yellow-500" size={18} />
                        ) : (
                            <FaMoon className="text-blue-500" size={18} />
                        )}
                        <span className="text-sm">
                            {theme === 'dark' ? '切换亮色模式' : '切换暗色模式'}
                        </span>
                    </button>

                    {/* Color Preset */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-text-muted">
                            <FaPalette size={14} />
                            <span>主题色</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.entries(themeColors) as [keyof typeof themeColors, { primary: string; name: string }][]).map(([key, { primary, name }]) => (
                                <button
                                    key={key}
                                    onClick={() => setPrimaryColor(key)}
                                    className={clsx(
                                        'relative w-10 h-10 rounded-full border-2 shadow-md transition-all motion-transition hover:scale-110',
                                        colorKey === key
                                            ? 'border-foreground ring-2 ring-offset-2 ring-primary'
                                            : 'border-white/50'
                                    )}
                                    style={{ backgroundColor: primary }}
                                    title={name}
                                >
                                    {colorKey === key && (
                                        <FaCheck className="absolute inset-0 m-auto text-white text-xs" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Button */}
            <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={clsx(
                    'p-4 rounded-full shadow-lg transition-all motion-transition',
                    'bg-gradient-to-br from-primary to-pink-500 text-white',
                    'hover:shadow-xl hover:scale-110',
                    settingsOpen && 'rotate-90'
                )}
                aria-label="Settings"
            >
                <FaCog size={20} className="transition-transform motion-transition" />
            </button>

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className={clsx(
                    'p-4 rounded-full shadow-lg transition-all motion-transition',
                    'bg-gradient-to-br from-blue-500 to-purple-500 text-white',
                    'hover:shadow-xl hover:scale-110',
                    showBackToTop
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                )}
                aria-label="Back to top"
            >
                <FaArrowUp size={20} />
            </button>
        </div>
    );
};
