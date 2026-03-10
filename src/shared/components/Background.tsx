'use client';

import { useEffect, useState } from 'react';
import { MOTION, getScrollProgress } from '@/shared/constants/motion';
import { LOCAL_BACKGROUND_IMAGE, getPageScopedBackgroundSource } from '@/shared/constants/backgrounds';

export const Background = () => {
    const [progress, setProgress] = useState(0);
    const [backgroundImage, setBackgroundImage] = useState(LOCAL_BACKGROUND_IMAGE);

    useEffect(() => {
        const handleScroll = () => {
            const heroHeight = window.innerHeight;
            const scrollY = window.scrollY;
            // 当滚动到 hero 区域 80% 时达到最大效果
            // 确保在最顶部时 progress 为 0 (无蒙版)
            // 越往下滚动，progress 越大，直到 1
            const newProgress = getScrollProgress(scrollY, heroHeight, MOTION.hero.backgroundFadeRatio);
            setProgress(newProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            setBackgroundImage(getPageScopedBackgroundSource());
        });
        return () => window.cancelAnimationFrame(frame);
    }, []);

    // 动态计算样式
    // 背景图：随滚动变为“线稿”风格 (去色 + 提高对比度 + 提亮)
    const bgStyle = {
        filter: `grayscale(${progress * 100}%) contrast(${100 + progress * MOTION.hero.contrastBoostPercent}%) brightness(${100 + progress * MOTION.hero.brightnessBoostPercent}%) blur(${progress * MOTION.hero.backgroundBlurMaxPx}px)`,
        transform: `scale(${1 + progress * MOTION.hero.backgroundScaleRange})`,
        opacity: 1 - progress * MOTION.hero.backgroundOpacityDrop, // 略微降低背景图本身的不透明度
    };

    // 遮罩层：随滚动变深
    // 白天模式：白色遮罩
    // 夜间模式：深色遮罩
    const overlayOpacity = progress * MOTION.hero.overlayMaxOpacity;

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-blue-50 opacity-50 dark:opacity-20 transition-opacity motion-transition-slow" />

            {/* Background Image with Dynamic Styles */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform motion-transition-micro will-change-transform"
                style={{
                    backgroundImage: `url("${backgroundImage}")`,
                    ...bgStyle
                }}
            />

            {/* Dynamic Overlay Mask */}
            <div
                className="absolute inset-0 pointer-events-none transition-colors motion-transition"
                style={{
                    opacity: overlayOpacity,
                    backgroundColor: 'var(--background)', // 使用全局背景色变量 (white / dark hex)
                }}
            />

            {/* 额外的渐变层增加层次感 (仅在滚动后显示) */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity motion-transition-slow"
                style={{ opacity: progress }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
            </div>
        </div>
    );
};

