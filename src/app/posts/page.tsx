'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { FaSearch } from 'react-icons/fa';
import { ArticleCard } from '@/features/article/components/ArticleCard';
import { ArticleListSkeleton } from '@/components/Skeleton';
import { articleApi, Article } from '@/shared/api/article';
import { categoryApi, Category } from '@/shared/api/category';
import { siteProfile } from '@/shared/constants/siteProfile';
import { getArticleExcerpt } from '@/shared/utils/getArticleExcerpt';
import { estimateReadingMinutes, getDisplayCategoryName } from '@/shared/utils/articleDisplay';

const PAGE_SIZE = 10;

type SortMode = 'latest' | 'popular' | 'featured';

export default function PostsPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [sortMode, setSortMode] = useState<SortMode>('latest');

    useEffect(() => {
        categoryApi.getList().then(setCategories).catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);

            try {
                const res = await articleApi.getList({
                    page: currentPage,
                    pageSize: PAGE_SIZE,
                    keyword: searchQuery || undefined,
                    category: selectedCategory || undefined,
                    preview: 1,
                });
                setArticles(res.rows || []);
                setTotalCount(res.count || 0);
            } catch (error) {
                console.error('Failed to fetch articles:', error);
                setArticles([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [currentPage, searchQuery, selectedCategory]);

    const visibleCategories = useMemo(() => {
        const grouped = new Map<string, { rawName: string; count: number }>();

        for (const category of categories) {
            const displayName = getDisplayCategoryName(category.name);
            const current = grouped.get(displayName);
            grouped.set(displayName, {
                rawName: current?.rawName || category.name,
                count: (current?.count || 0) + category.count,
            });
        }

        return [...grouped.entries()]
            .sort((left, right) => right[1].count - left[1].count)
            .map(([displayName, data]) => ({ displayName, ...data }));
    }, [categories]);

    const sortedArticles = useMemo(() => {
        const items = [...articles];

        if (sortMode === 'popular') {
            items.sort((left, right) => (right.viewCount || 0) - (left.viewCount || 0));
            return items;
        }

        if (sortMode === 'featured') {
            items.sort((left, right) => {
                const leftScore = (left.viewCount || 0) + (left.tags?.length || 0) * 12 + (left.category ? 8 : 0);
                const rightScore = (right.viewCount || 0) + (right.tags?.length || 0) * 12 + (right.category ? 8 : 0);
                return rightScore - leftScore;
            });
            return items;
        }

        items.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
        return items;
    }, [articles, sortMode]);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    const activeCategoryLabel = selectedCategory ? getDisplayCategoryName(selectedCategory) : '全部';

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        setCurrentPage(1);
        setSearchQuery(searchInput.trim());
    };

    return (
        <div className="min-h-screen pb-16 pt-20">
            <div className="bg-gradient-to-br from-primary/10 via-pink-100/20 to-purple-100/10 py-16 dark:from-primary/5 dark:via-purple-900/10 dark:to-transparent">
                <div className="container mx-auto max-w-6xl px-4 space-y-6">
                    <div className="space-y-3 text-center">
                        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                            Content Index
                        </p>
                        <h1 className="text-4xl font-bold font-serif">文章索引</h1>
                        <p className="mx-auto max-w-3xl text-sm leading-7 text-text-muted">
                            不只是按时间堆文章，而是尽量让你更快判断：这篇是在写技术、读书、生活还是日常，现在哪一篇最适合你打开。
                        </p>
                        <p className="text-sm text-text-muted">
                            当前筛选：<span className="font-medium text-foreground">{activeCategoryLabel}</span>
                            {searchQuery ? <> · 关键词 “{searchQuery}”</> : null}
                            {' · 共 '}<span className="font-medium text-primary">{totalCount}</span> 篇文章
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="relative mx-auto max-w-2xl">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder="搜索文章标题、内容，或者你此刻关心的主题..."
                            className="w-full rounded-2xl border border-card-border bg-white/80 px-6 py-4 pl-12 shadow-lg backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800/80"
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary px-6 py-2 text-white transition-colors hover:bg-primary/90"
                        >
                            搜索
                        </button>
                    </form>

                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => {
                                setSelectedCategory(null);
                                setCurrentPage(1);
                            }}
                            className={clsx(
                                'rounded-full px-4 py-2 text-sm transition-colors',
                                selectedCategory === null
                                    ? 'bg-primary text-white'
                                    : 'bg-card-bg/70 text-text-muted hover:text-primary'
                            )}
                        >
                            全部
                        </button>
                        {visibleCategories.slice(0, 8).map((category) => (
                            <button
                                key={category.displayName}
                                onClick={() => {
                                    setSelectedCategory(category.rawName);
                                    setCurrentPage(1);
                                }}
                                className={clsx(
                                    'rounded-full px-4 py-2 text-sm transition-colors',
                                    selectedCategory === category.rawName
                                        ? 'bg-primary text-white'
                                        : 'bg-card-bg/70 text-text-muted hover:text-primary'
                                )}
                            >
                                {category.displayName}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-text-muted">
                        <span>专题入口：</span>
                        {siteProfile.topics.map((topic) => (
                            <Link
                                key={topic.name}
                                href={topic.href}
                                className="rounded-full border border-card-border px-3 py-1.5 transition-colors hover:border-primary/30 hover:text-primary"
                            >
                                {topic.name}
                            </Link>
                            ))}
                    </div>

                    <p className="text-center text-sm leading-7 text-text-muted">
                        这里会混合出现技术笔记、读书心得、生活记录和日常随笔，不必急着给自己限定阅读类型。
                    </p>

                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { label: '最新发布', value: 'latest' },
                            { label: '最多阅读', value: 'popular' },
                            { label: '编辑精选', value: 'featured' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSortMode(option.value as SortMode)}
                                className={clsx(
                                    'rounded-full px-4 py-2 text-sm transition-colors',
                                    sortMode === option.value
                                        ? 'bg-foreground text-background'
                                        : 'bg-card-bg/70 text-text-muted hover:text-primary'
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-12">
                {loading ? (
                    <ArticleListSkeleton count={5} />
                ) : sortedArticles.length > 0 ? (
                    <div className="space-y-8">
                        {sortedArticles.map((article, index) => (
                            <ArticleCard
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                summary={getArticleExcerpt(article.content, 150)}
                                content={article.content}
                                cover={article.cover}
                                createdAt={article.createdAt}
                                category={article.category || article.categories?.[0]}
                                tags={article.tags}
                                index={index}
                                viewCount={article.viewCount}
                                commentCount={article.comments?.length || 0}
                                readingMinutes={estimateReadingMinutes(article.content)}
                                articleType={sortMode === 'featured' ? '精选' : undefined}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-card-border bg-card-bg/70 px-6 py-16 text-center">
                        <div className="mb-4 text-6xl">📭</div>
                        <h3 className="text-xl font-bold mb-2">暂时没有匹配的文章</h3>
                        <p className="text-text-muted">
                            你可以换个关键词试试，或者先去首页看看推荐阅读。
                        </p>
                        <Link
                            href="/"
                            className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                        >
                            去首页看看
                        </Link>
                    </div>
                )}

                {totalPages > 1 ? (
                    <div className="mt-12 flex justify-center items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            disabled={currentPage === 1}
                            className={clsx(
                                'rounded-lg px-4 py-2 transition-all',
                                currentPage === 1
                                    ? 'cursor-not-allowed bg-card-border text-text-muted'
                                    : 'border border-card-border bg-card-bg hover:border-primary hover:bg-primary hover:text-white'
                            )}
                        >
                            上一页
                        </button>

                        {[...Array(Math.min(5, totalPages))].map((_, index) => {
                            let pageNum: number;

                            if (totalPages <= 5) {
                                pageNum = index + 1;
                            } else if (currentPage <= 3) {
                                pageNum = index + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + index;
                            } else {
                                pageNum = currentPage - 2 + index;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={clsx(
                                        'h-10 w-10 rounded-lg transition-all',
                                        currentPage === pageNum
                                            ? 'bg-primary text-white'
                                            : 'border border-card-border bg-card-bg hover:border-primary hover:bg-primary hover:text-white'
                                    )}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                            disabled={currentPage === totalPages}
                            className={clsx(
                                'rounded-lg px-4 py-2 transition-all',
                                currentPage === totalPages
                                    ? 'cursor-not-allowed bg-card-border text-text-muted'
                                    : 'border border-card-border bg-card-bg hover:border-primary hover:bg-primary hover:text-white'
                            )}
                        >
                            下一页
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
    );
}
