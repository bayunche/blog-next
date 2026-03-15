'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaChevronDown, FaCodeBranch, FaGithub, FaSyncAlt } from 'react-icons/fa';
import { MOTION, clamp, getScrollProgress } from '@/shared/constants/motion';
import { LOCAL_BACKGROUND_IMAGE, getPageScopedBackgroundSource } from '@/shared/constants/backgrounds';
import { siteProfile } from '@/shared/constants/siteProfile';

interface HitokotoResponse {
    hitokoto: string;
    from: string;
    from_who: string | null;
}

const FALLBACK = {
    hitokoto: '愿每一篇认真写下来的文章，都能帮后来者少走一点弯路。',
    from: '落樱轻声',
    from_who: null,
};

const socialIconMap = {
    github: FaGithub,
    repo: FaCodeBranch,
};

async function fetchHitokoto(): Promise<HitokotoResponse> {
    const res = await fetch('https://v1.hitokoto.cn/?encode=json&c=a&c=c&c=d', {
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('hitokoto fetch failed');
    }

    return res.json();
}

export function Hero() {
    const [quote, setQuote] = useState<HitokotoResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [backgroundImage, setBackgroundImage] = useState(LOCAL_BACKGROUND_IMAGE);
    const heroRef = useRef<HTMLElement>(null);

    const loadQuote = useCallback(async () => {
        setLoading(true);

        try {
            const data = await fetchHitokoto();
            setQuote(data);
        } catch {
            setQuote(FALLBACK);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            setBackgroundImage(getPageScopedBackgroundSource());
        });

        return () => window.cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        loadQuote();

        const handleScroll = () => {
            if (!heroRef.current) {
                return;
            }

            const rect = heroRef.current.getBoundingClientRect();
            if (rect.bottom > 0) {
                setScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadQuote]);

    const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
    const backgroundProgress = getScrollProgress(scrollY, heroHeight, MOTION.hero.backgroundFadeRatio);
    const contentProgress = getScrollProgress(scrollY, heroHeight, MOTION.hero.contentFadeRatio);
    const backgroundOpacity = clamp(1 - backgroundProgress, 0, 1);
    const contentOpacity = clamp(1 - contentProgress, 0, 1);
    const contentOffset = scrollY * MOTION.hero.contentOffsetFactor;
    const contentScale = Math.max(MOTION.hero.contentScaleMin, 1 - scrollY / MOTION.hero.contentScaleDivisor);

    const socialLinks = useMemo(
        () => siteProfile.socialLinks.map((link) => ({ ...link, Icon: socialIconMap[link.platform] })),
        []
    );

    return (
        <section
            ref={heroRef}
            className="relative flex min-h-[100svh] items-center overflow-hidden text-white"
        >
            <div
                className="absolute inset-0 transition-opacity motion-transition-micro"
                style={{ opacity: backgroundOpacity }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-sky-500 dark:from-gray-950 dark:via-purple-950 dark:to-slate-900" />
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(\"${backgroundImage}\")`, opacity: 0.28 }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-background/95" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/35 to-transparent" />
            </div>

            <div
                className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-24 pt-28 sm:gap-10 sm:py-24 lg:flex-row lg:items-center lg:justify-between"
                style={{
                    opacity: contentOpacity,
                    transform: `translate3d(0, ${-contentOffset}px, 0) scale(${contentScale})`,
                }}
            >
                <div className="max-w-3xl space-y-6 sm:space-y-7">
                    <div className="inline-flex max-w-full items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs backdrop-blur-md sm:text-sm">
                        个人博客 · 也写技术，也写生活
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-[0.32em] text-white/75 sm:text-sm sm:tracking-[0.38em]">
                                {siteProfile.siteNameEn}
                            </p>
                            <h1 className="text-3xl font-bold font-serif leading-tight sm:text-4xl md:text-6xl">
                                {siteProfile.siteName}
                            </h1>
                        </div>

                        <p className="max-w-2xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8 md:text-2xl md:leading-10">
                            {siteProfile.tagline}
                        </p>
                        <p className="max-w-2xl text-sm leading-8 text-white/70 md:text-base">
                            {siteProfile.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {siteProfile.heroBadges.map((badge) => (
                            <span
                                key={badge}
                                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur-md"
                            >
                                {badge}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {siteProfile.homeCtas.map((cta) => {
                            const baseClass = [
                                'inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all motion-transition sm:w-auto',
                                cta.style === 'primary'
                                    ? 'bg-white text-slate-900 hover:bg-white/90'
                                    : cta.style === 'secondary'
                                        ? 'border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
                                        : 'text-white/80 hover:text-white',
                            ].join(' ');

                            if (cta.href.startsWith('#')) {
                                return (
                                    <a key={cta.label} href={cta.href} className={baseClass}>
                                        {cta.label}
                                    </a>
                                );
                            }

                            return (
                                <Link key={cta.label} href={cta.href} className={baseClass}>
                                    {cta.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        {socialLinks.map(({ href, label, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-md transition-all motion-transition hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto"
                            >
                                <Icon size={15} />
                                <span>{label}</span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-md space-y-5 sm:space-y-6 lg:ml-6">
                    <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-2xl sm:p-6">
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/20">
                                <Image
                                    src={siteProfile.author.avatar}
                                    alt={siteProfile.author.shortName}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <p className="text-sm text-white/65">{siteProfile.author.role}</p>
                                <h2 className="mt-1 text-2xl font-bold font-serif">
                                    {siteProfile.author.shortName}
                                </h2>
                                <p className="mt-2 text-sm text-white/70">
                                    {siteProfile.author.location}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {siteProfile.currentMoments.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-white/10 bg-black/15 p-4"
                                >
                                    <h3 className="text-sm font-semibold text-white">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-xs leading-6 text-white/70">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl shadow-xl sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 text-left">
                                <p className="text-sm uppercase tracking-[0.28em] text-white/65">
                                    此刻想记住的一句话
                                </p>
                                <p className={`text-sm leading-7 transition-opacity sm:text-base sm:leading-8 ${loading ? 'opacity-45' : 'opacity-100'}`}>
                                    {quote ? quote.hitokoto : '...'}
                                </p>
                                {quote ? (
                                    <p className="text-xs text-white/60">
                                        —— {quote.from_who ? `${quote.from_who}《${quote.from}》` : `《${quote.from}》`}
                                    </p>
                                ) : null}
                            </div>

                            <button
                                onClick={loadQuote}
                                disabled={loading}
                                aria-label="换一句"
                                className="rounded-full border border-white/15 bg-black/15 p-2 text-white/70 transition-colors hover:text-white disabled:cursor-not-allowed"
                            >
                                <FaSyncAlt size={14} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <a
                href="#featured"
                className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 animate-bounce p-2 text-white/80 transition-colors hover:text-white sm:bottom-12"
                aria-label="向下滚动"
                style={{ opacity: contentOpacity }}
            >
                <FaChevronDown size={28} />
            </a>
        </section>
    );
}
