'use client';

import { useEffect, useState, useRef } from 'react';
import { FaGithub, FaTwitter, FaChevronDown, FaTelegram, FaRss } from 'react-icons/fa';
import { SiBilibili } from 'react-icons/si';
import Image from 'next/image';
import { MOTION, clamp, getScrollProgress } from '@/shared/constants/motion';

// 一言 API 或静态格言
const HITOKOTO_LIST = [
    "太阳出来了，雾就会散的。",
    "生命璀璨如歌，愿你不虚此行。",
    "信じてること自体が希望なんだ。",
    "Life is a journey, not a destination.",
    "春风得意马蹄疾，一日看尽长安花。",
];

export const Hero = () => {
    const [hitokoto, setHitokoto] = useState('');
    const [mounted, setMounted] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setMounted(true);
        // 随机选择一句格言
        const randomIndex = Math.floor(Math.random() * HITOKOTO_LIST.length);
        setHitokoto(HITOKOTO_LIST[randomIndex]);

        // 视差滚动监听
        const handleScroll = () => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                if (rect.bottom > 0) {
                    setScrollY(window.scrollY);
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
        });
    };

    // 社交链接配置
    const socialLinks = [
        { icon: FaGithub, href: 'https://github.com', label: 'GitHub', color: 'hover:bg-gray-700' },
        { icon: FaTelegram, href: 'https://t.me', label: 'Telegram', color: 'hover:bg-blue-500' },
        { icon: SiBilibili, href: 'https://bilibili.com', label: 'Bilibili', color: 'hover:bg-pink-500' },
        { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-sky-500' },
        { icon: FaRss, href: '/rss', label: 'RSS', color: 'hover:bg-orange-500' },
    ];

    // 视差偏移计算 - 优化版：背景固定，内容上移，整体渐隐
    const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    // 背景固定，不移动，但渐隐
    const backgroundProgress = getScrollProgress(scrollY, heroHeight, MOTION.hero.backgroundFadeRatio);
    const backgroundOpacity = clamp(1 - backgroundProgress, 0, 1);
    // 内容区域向上移动并渐隐
    const contentProgress = getScrollProgress(scrollY, heroHeight, MOTION.hero.contentFadeRatio);
    const contentOffset = scrollY * MOTION.hero.contentOffsetFactor;
    const contentOpacity = clamp(1 - contentProgress, 0, 1);
    const contentScale = Math.max(MOTION.hero.contentScaleMin, 1 - scrollY / MOTION.hero.contentScaleDivisor);

    return (
        <section
            ref={heroRef}
            className="relative h-screen flex flex-col justify-center items-center text-center text-white overflow-hidden"
        >
            {/* Background - 固定位置，向下滚动渐隐 */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-500 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 transition-opacity motion-transition-micro"
                style={{ opacity: backgroundOpacity }}
            >
                {/* 背景图片层 - 可选 */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(/images/background.jpg)',
                        opacity: 0.3,
                    }}
                />
                {/* Decorative gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
            </div>

            {/* Content with parallax - 向上移动并渐隐 */}
            <div
                className="z-10 space-y-6 animate-fade-in-up"
                style={{
                    transform: `translateY(${-contentOffset}px) scale(${contentScale})`,
                    opacity: contentOpacity,
                    transition: `opacity ${MOTION.durationMs.micro}ms ${MOTION.easing.decelerate}`,
                }}
            >
                {/* Avatar with glow effect */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white/50 overflow-hidden mx-auto shadow-2xl animate-glow hover:rotate-[360deg] motion-transition-slow">
                        <Image
                            src="/images/avatar.jpg"
                            alt="Avatar"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Site Title */}
                <h1 className="text-3xl md:text-4xl font-bold tracking-wider drop-shadow-lg">
                    云昔 Blog
                </h1>

                {/* Glassmorphism Hitokoto Box */}
                <div className="relative mx-4">
                    <div className="bg-white/20 backdrop-blur-xl rounded-2xl px-8 py-4 border border-white/30 shadow-xl hover:bg-white/25 motion-transition">
                        <p className="text-lg md:text-xl font-medium" suppressHydrationWarning>
                            {mounted ? hitokoto : '...'}
                        </p>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center gap-4 mt-6">
                    {socialLinks.map((item, i) => (
                        <a
                            key={i}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={item.label}
                            className={`group relative p-3 bg-white/20 ${item.color} rounded-full backdrop-blur-md motion-transition hover:-translate-y-2 hover:shadow-xl`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <item.icon size={20} className="motion-transition group-hover:scale-110" />
                            {/* Tooltip */}
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-black/70 px-2 py-1 rounded opacity-0 group-hover:opacity-100 motion-transition whitespace-nowrap">
                                {item.label}
                            </span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Wave Effect at bottom - matching Sakurairo style */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg
                    className="relative block w-[calc(100%+1.3px)] h-[120px]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className="fill-white/40"
                    />
                    <path
                        d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                        className="fill-background"
                    />
                </svg>
            </div>

            {/* Scroll Down Indicator */}
            <button
                onClick={scrollToContent}
                className="absolute bottom-16 z-20 animate-bounce cursor-pointer p-2 text-white/80 hover:text-white motion-transition"
                aria-label="Scroll down"
                style={{ opacity: contentOpacity }}
            >
                <FaChevronDown size={32} />
            </button>
        </section>
    );
};
