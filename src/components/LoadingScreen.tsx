'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

export const LoadingScreen = () => {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const petalDurations = [3.1, 3.4, 3.7, 4.0, 4.3, 4.6, 4.9, 5.2];

    useEffect(() => {
        // 缩短首屏遮罩时间，降低对交互与跳转的阻塞
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }, 450);

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div
            className={clsx(
                'fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-opacity duration-500',
                fadeOut && 'opacity-0'
            )}
        >
            {/* Logo 动画 */}
            <div className="relative">
                {/* 外圈旋转 */}
                <div className="absolute inset-0 w-32 h-32 border-4 border-pink-200 rounded-full animate-spin-slow" />
                <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-primary rounded-full animate-spin" />

                {/* 樱花图标 */}
                <div className="w-32 h-32 flex items-center justify-center">
                    <svg
                        viewBox="0 0 100 100"
                        className="w-20 h-20 animate-pulse-slow"
                    >
                        {/* 樱花花瓣 */}
                        {[0, 72, 144, 216, 288].map((rotation, i) => (
                            <ellipse
                                key={i}
                                cx="50"
                                cy="30"
                                rx="12"
                                ry="25"
                                fill="url(#sakuraGradient)"
                                transform={`rotate(${rotation} 50 50)`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        ))}
                        {/* 花蕊 */}
                        <circle cx="50" cy="50" r="8" fill="#ffd700" />

                        <defs>
                            <linearGradient id="sakuraGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffb7c5" />
                                <stop offset="100%" stopColor="#ff6b9d" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* 加载文字 */}
            <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Sakurairo
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                    加载中...
                </p>
            </div>

            {/* 加载进度条 */}
            <div className="mt-6 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-loading-bar" />
            </div>

            {/* 飘落的樱花装饰 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float-down"
                        style={{
                            left: `${10 + i * 12}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: `${petalDurations[i]}s`,
                        }}
                    >
                        <svg viewBox="0 0 20 20" className="w-4 h-4 text-pink-300 dark:text-pink-500">
                            <ellipse cx="10" cy="5" rx="3" ry="5" fill="currentColor" />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
};
