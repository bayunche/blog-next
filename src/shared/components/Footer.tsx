'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { categoryApi, Category } from '@/shared/api/category';
import { siteLinks, siteProfile } from '@/shared/constants/siteProfile';
import { buildTopicCards } from '@/shared/utils/topicCards';

export function Footer() {
    const githubLink = siteProfile.socialLinks[0]?.href;
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        let cancelled = false;

        categoryApi.getPublicList()
            .then((result) => {
                if (cancelled) return;
                setCategories(result || []);
            })
            .catch(() => {
                if (cancelled) return;
                setCategories([]);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const topicCards = useMemo(() => buildTopicCards(categories, 6), [categories]);

    return (
        <footer className="mt-20 border-t border-card-border/70 bg-card-bg/75 backdrop-blur-sm transition-colors">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between md:px-6 lg:px-8">
                <div className="max-w-xl space-y-3">
                    <h3 className="text-2xl font-bold font-serif">{siteProfile.siteName}</h3>
                    <p className="text-sm leading-7 text-text-muted">
                        {siteProfile.description}
                    </p>
                    <p className="text-xs text-text-subtle">
                        既写技术，也写阅读、生活和普通日子里那些值得被留下来的小事。
                    </p>
                </div>

                <div className="flex flex-wrap gap-8 text-sm">
                    <div className="space-y-3">
                        <p className="font-semibold text-foreground">导航</p>
                        <div className="flex flex-col gap-2 text-text-muted">
                            <Link href={siteLinks.posts} className="hover:text-primary">文章</Link>
                            <Link href={siteLinks.archives} className="hover:text-primary">归档</Link>
                            <Link href={siteLinks.about} className="hover:text-primary">关于</Link>
                            <Link href={siteLinks.friends} className="hover:text-primary">友链</Link>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="font-semibold text-foreground">专题</p>
                        <div className="flex flex-col gap-2 text-text-muted">
                            {topicCards.length > 0 ? topicCards.map((topic) => (
                                <Link key={topic.rawName} href={topic.href} className="hover:text-primary">
                                    {topic.displayName}
                                </Link>
                            )) : siteProfile.topics.slice(0, 6).map((topic) => (
                                <Link key={topic.name} href={topic.href} className="hover:text-primary">
                                    {topic.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-card-border/70 px-4 py-4 text-sm text-text-muted md:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p>© {new Date().getFullYear()} {siteProfile.siteName}. Built with Next.js.</p>
                    <div className="flex items-center gap-4">
                        {githubLink ? (
                            <a
                                href={githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 hover:text-primary"
                            >
                                <FaGithub size={14} />
                                GitHub
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>
        </footer>
    );
}
