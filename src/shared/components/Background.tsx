'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

export const Background = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // 使用视口高度作为阈值：只有滚动超过 Hero 区域（一屏高度）时才虚化
            const heroHeight = window.innerHeight;
            setScrolled(window.scrollY > heroHeight - 100);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden transition-all duration-700 ease-in-out">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-blue-50 opacity-50 dark:opacity-20" />

            {/* Background Image with transitions */}
            <div
                className={clsx(
                    "absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out transform",
                    scrolled ? "blur-md scale-105 opacity-80" : "blur-0 scale-100 opacity-100"
                )}
                style={{ backgroundImage: 'url("https://api.dujin.org/bing/1920.php")' }}
            />

            {/* Overlay for contrast when scrolled - 增加顶部和底部的渐变遮罩，模拟 Sakurairo 风格 */}
            <div
                className={clsx(
                    "absolute inset-0 transition-opacity duration-700 pointer-events-none",
                    scrolled ? "opacity-100" : "opacity-0"
                )}
            >
                {/* 整体紫色遮罩 */}
                <div className="absolute inset-0 bg-purple-900/10 mix-blend-overlay" />

                {/* 顶部渐变 - 保证导航栏文字清晰 */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-900/30 to-transparent" />

                {/* 底部渐变 */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/30 to-transparent" />
            </div>

            {/* 白天模式的额外遮罩，防止背景太亮 */}
            <div className={clsx(
                "absolute inset-0 pointer-events-none transition-all duration-700",
                scrolled ? "bg-white/30 dark:bg-black/40" : "bg-transparent"
            )} />
        </div>
    );
};

