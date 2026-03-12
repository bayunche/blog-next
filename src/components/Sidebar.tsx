'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaClock, FaFire, FaFolderOpen, FaGithub, FaHeart, FaTags } from 'react-icons/fa';
import { articleApi } from '@/shared/api/article';
import { Category, categoryApi } from '@/shared/api/category';
import { Tag, tagApi } from '@/shared/api/tag';
import { getDisplayCategoryName } from '@/shared/utils/articleDisplay';
import { siteProfile } from '@/shared/constants/siteProfile';

export function Sidebar() {
    const { data: recentPosts, isLoading: postsLoading } = useQuery({
        queryKey: ['articles', 'recent-sidebar'],
        queryFn: () => articleApi.getList({ page: 1, pageSize: 5, preview: 1 }),
    });

    const { data: categories, isLoading: catsLoading } = useQuery({
        queryKey: ['categories', 'sidebar'],
        queryFn: () => categoryApi.getList(),
    });

    const { data: tags, isLoading: tagsLoading } = useQuery({
        queryKey: ['tags', 'sidebar'],
        queryFn: () => tagApi.getList(),
    });

    const visibleCategories = useMemo(() => {
        const grouped = new Map<string, number>();

        for (const item of categories || []) {
            const displayName = getDisplayCategoryName(item.name);
            grouped.set(displayName, (grouped.get(displayName) || 0) + item.count);
        }

        return [...grouped.entries()]
            .filter(([name]) => name !== '未分类')
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, count]) => ({ name, count } satisfies Category));
    }, [categories]);

    const visibleTags = useMemo(
        () => [...(tags || [])].sort((a, b) => b.count - a.count).slice(0, 12),
        [tags]
    );

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    };

    return (
        <aside className="w-80 space-y-6">
            <div className="rounded-3xl border border-card-border/80 bg-card-bg/80 p-6 text-center shadow-sm backdrop-blur-sm">
                <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-primary/20">
                    <Image
                        src={siteProfile.author.avatar}
                        alt={siteProfile.author.shortName}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                </div>
                <h3 className="text-xl font-bold font-serif">{siteProfile.author.shortName}</h3>
                <p className="mt-2 text-sm text-text-muted">{siteProfile.author.role}</p>
                <p className="mt-4 text-sm leading-7 text-text-muted">
                    这里会写代码，也会写读书时的触动、生活里的小事，以及那些不想让它们就这样过去的普通日常。
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {siteProfile.capabilityTags.slice(0, 4).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-card-border px-3 py-1 text-xs text-text-muted"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-6 flex justify-center gap-3">
                    <Link
                        href="/about"
                        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                    >
                        关于我
                    </Link>
                    <a
                        href={siteProfile.socialLinks[0].href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-card-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-primary/30 hover:text-primary"
                    >
                        <FaGithub size={14} />
                        GitHub
                    </a>
                </div>
            </div>

            <div className="rounded-3xl border border-card-border/80 bg-card-bg/80 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="mb-4 flex items-center gap-2 border-b border-card-border pb-3 font-bold">
                    <FaFire className="text-red-500" /> 最新文章
                </h3>
                {postsLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="animate-pulse">
                                <div className="mb-2 h-4 w-3/4 rounded bg-card-border"></div>
                                <div className="h-3 w-1/4 rounded bg-card-border"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {(recentPosts?.rows || []).map((article) => (
                            <li key={article.id} className="group">
                                <Link
                                    href={`/posts/${article.id}`}
                                    className="line-clamp-2 text-sm text-text-muted transition-colors hover:text-primary"
                                >
                                    {article.title}
                                </Link>
                                <div className="mt-1 flex items-center gap-2 text-xs text-text-subtle">
                                    <FaClock className="text-[10px]" />
                                    <span>{formatDate(article.createdAt)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="rounded-3xl border border-card-border/80 bg-card-bg/80 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="mb-4 flex items-center gap-2 border-b border-card-border pb-3 font-bold">
                    <FaFolderOpen className="text-yellow-500" /> 分类
                </h3>
                {catsLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex animate-pulse justify-between">
                                <div className="h-4 w-20 rounded bg-card-border"></div>
                                <div className="h-4 w-8 rounded bg-card-border"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {visibleCategories.map((cat) => (
                            <li key={cat.name}>
                                <Link
                                    href={`/categories/${encodeURIComponent(cat.name)}`}
                                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-text-muted transition-colors hover:bg-card-border/50 hover:text-primary"
                                >
                                    <span>{cat.name}</span>
                                    <span className="rounded-full bg-card-border px-2 py-0.5 text-xs text-text-subtle">
                                        {cat.count}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="rounded-3xl border border-card-border/80 bg-card-bg/80 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="mb-4 flex items-center gap-2 border-b border-card-border pb-3 font-bold">
                    <FaTags className="text-green-500" /> 高频标签
                </h3>
                {tagsLoading ? (
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="h-6 w-16 animate-pulse rounded-full bg-card-border"></div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {visibleTags.map((tag: Tag) => (
                            <Link
                                key={tag.name}
                                href={`/tags/${encodeURIComponent(tag.name)}`}
                                className="group rounded-full bg-card-border px-3 py-1 text-xs text-text-muted transition-colors hover:bg-primary hover:text-white"
                            >
                                {tag.name}
                                <span className="ml-1 opacity-60 group-hover:opacity-100">({tag.count})</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-3xl border border-card-border/80 bg-card-bg/80 p-6 shadow-sm backdrop-blur-sm">
                <h3 className="mb-4 flex items-center gap-2 border-b border-card-border pb-3 font-bold">
                    <FaHeart className="text-pink-500" /> 最近想留下的东西
                </h3>
                <div className="space-y-4">
                    {siteProfile.currentMoments.map((item) => (
                        <div key={item.title} className="rounded-2xl bg-gradient-to-br from-primary/8 to-primary/5 p-4">
                            <p className="text-sm font-semibold text-foreground">{item.title}</p>
                            <p className="mt-2 text-xs leading-6 text-text-muted">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
