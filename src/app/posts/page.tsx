'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { FaSearch, FaTags, FaFolder, FaFilter } from 'react-icons/fa';
import { ArticleCard } from '@/features/article/components/ArticleCard';
import { ArticleListSkeleton } from '@/components/Skeleton';
import { articleApi, Article } from '@/shared/api/article';
import { clsx } from 'clsx';

// 每页显示数量
const PAGE_SIZE = 10;

export default function PostsPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);

    // 获取文章列表
    const fetchArticles = async (page: number, keyword?: string, categoryId?: number) => {
        setLoading(true);
        try {
            const res = await articleApi.getList({
                page,
                pageSize: PAGE_SIZE,
                keyword: keyword || undefined,
                categoryId: categoryId || undefined,
            });
            setArticles(res.rows || []);
            setTotalCount(res.count || 0);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    // 初始加载
    useEffect(() => {
        fetchArticles(currentPage);
    }, [currentPage]);

    // 搜索处理
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchArticles(1, searchQuery);
    };

    // 分页计算
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    return (
        <div className="min-h-screen pt-20 pb-16">
            {/* 页面头部 */}
            <div className="bg-gradient-to-br from-primary/10 via-pink-100/20 to-purple-100/10 dark:from-primary/5 dark:via-purple-900/10 dark:to-transparent py-16">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h1 className="text-4xl font-bold font-serif text-center mb-4">
                        📝 文章列表
                    </h1>
                    <p className="text-center text-text-muted mb-8">
                        共 {totalCount} 篇文章，记录学习与生活
                    </p>

                    {/* 搜索框 */}
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="搜索文章标题或内容..."
                            className="w-full px-6 py-4 pl-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-card-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                        >
                            搜索
                        </button>
                    </form>
                </div>
            </div>

            {/* 文章列表 */}
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {loading ? (
                    <ArticleListSkeleton count={5} />
                ) : articles.length > 0 ? (
                    <div className="space-y-8">
                        {articles.map((article, index) => (
                            <ArticleCard
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                summary={article.content.substring(0, 150) + '...'}
                                cover={article.cover}
                                createdAt={article.createdAt}
                                category={article.category}
                                tags={article.tags}
                                index={index}
                                viewCount={article.viewCount}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold mb-2">暂无文章</h3>
                        <p className="text-text-muted">
                            {searchQuery ? '没有找到匹配的文章，试试其他关键词？' : '博主还没有发布文章哦~'}
                        </p>
                    </div>
                )}

                {/* 分页 */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={clsx(
                                'px-4 py-2 rounded-lg transition-all',
                                currentPage === 1
                                    ? 'bg-card-border text-text-muted cursor-not-allowed'
                                    : 'bg-card-bg border border-card-border hover:bg-primary hover:text-white hover:border-primary'
                            )}
                        >
                            上一页
                        </button>

                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={clsx(
                                        'w-10 h-10 rounded-lg transition-all',
                                        currentPage === pageNum
                                            ? 'bg-primary text-white'
                                            : 'bg-card-bg border border-card-border hover:bg-primary hover:text-white hover:border-primary'
                                    )}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className={clsx(
                                'px-4 py-2 rounded-lg transition-all',
                                currentPage === totalPages
                                    ? 'bg-card-border text-text-muted cursor-not-allowed'
                                    : 'bg-card-bg border border-card-border hover:bg-primary hover:text-white hover:border-primary'
                            )}
                        >
                            下一页
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
