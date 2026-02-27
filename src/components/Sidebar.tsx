'use client';

import { FaTags, FaFolderOpen, FaFire, FaClock, FaHeart } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { articleApi } from '@/shared/api/article';
import { categoryApi, Category } from '@/shared/api/category';
import { tagApi, Tag } from '@/shared/api/tag';

export const Sidebar = () => {
    // 获取最新文章
    const { data: recentPosts, isLoading: postsLoading } = useQuery({
        queryKey: ['articles', 'recent'],
        queryFn: () => articleApi.getList({ page: 1, pageSize: 5 }),
    });

    // 获取分类
    const { data: categories, isLoading: catsLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryApi.getList(),
    });

    // 获取标签
    const { data: tags, isLoading: tagsLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: () => tagApi.getList(),
    });

    // 格式化日期 - 使用固定格式避免 hydration 不匹配
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
    };

    return (
        <aside className="w-full md:w-80 space-y-8">
            {/* Author Card */}
            <div className="bg-card-bg rounded-xl shadow-sm p-6 text-center animate-fade-in-up transition-colors">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-primary/20 relative">
                    <Image
                        src="/images/avatar.jpg"
                        alt="Author"
                        fill
                        className="object-cover transition-transform hover:rotate-[360deg] duration-700"
                    />
                </div>
                <h3 className="text-xl font-bold mb-2">Sakurairo Blog</h3>
                <p className="text-text-muted text-sm mb-6">在这里记录生活、编程与一切美好。</p>
                <div className="flex justify-center gap-8 text-sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{recentPosts?.count || 0}</div>
                        <div className="text-text-muted text-xs">文章</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-pink-500">{categories?.length || 0}</div>
                        <div className="text-text-muted text-xs">分类</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{tags?.length || 0}</div>
                        <div className="text-text-muted text-xs">标签</div>
                    </div>
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-card-bg rounded-xl shadow-sm p-6 animate-fade-in-up transition-colors" style={{ animationDelay: '0.1s' }}>
                <h3 className="font-bold mb-4 flex items-center gap-2 border-b border-card-border pb-2">
                    <FaFire className="text-red-500" /> 最新文章
                </h3>
                {postsLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse">
                                <div className="h-4 bg-card-border rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-card-border rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {(recentPosts?.rows || []).slice(0, 5).map(article => (
                            <li key={article.id} className="group">
                                <Link href={`/posts/${article.id}`} className="text-sm text-text-muted hover:text-primary transition-colors line-clamp-2">
                                    {article.title}
                                </Link>
                                <div className="flex items-center gap-2 text-xs text-text-subtle mt-1">
                                    <FaClock className="text-xs" />
                                    <span>{formatDate(article.createdAt)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Categories */}
            <div className="bg-card-bg rounded-xl shadow-sm p-6 animate-fade-in-up transition-colors" style={{ animationDelay: '0.2s' }}>
                <h3 className="font-bold mb-4 flex items-center gap-2 border-b border-card-border pb-2">
                    <FaFolderOpen className="text-yellow-500" /> 分类
                </h3>
                {catsLoading ? (
                    <div className="space-y-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex justify-between">
                                <div className="h-4 bg-card-border rounded w-20"></div>
                                <div className="h-4 bg-card-border rounded w-8"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {(categories || []).slice(0, 6).map((cat: Category) => (
                            <li key={cat.name}>
                                <Link href={`/categories/${encodeURIComponent(cat.name)}`} className="flex justify-between items-center text-sm text-text-muted hover:text-primary hover:bg-card-border/50 px-2 py-1 rounded transition-colors">
                                    <span>{cat.name}</span>
                                    <span className="bg-card-border text-text-subtle text-xs px-2 py-0.5 rounded-full">{cat.count}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Tags */}
            <div className="bg-card-bg rounded-xl shadow-sm p-6 animate-fade-in-up transition-colors" style={{ animationDelay: '0.3s' }}>
                <h3 className="font-bold mb-4 flex items-center gap-2 border-b border-card-border pb-2">
                    <FaTags className="text-green-500" /> 标签
                </h3>
                {tagsLoading ? (
                    <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="animate-pulse h-6 bg-card-border rounded-full w-16"></div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {(tags || []).slice(0, 12).map((tag: Tag) => (
                            <Link
                                key={tag.name}
                                href={`/tags/${encodeURIComponent(tag.name)}`}
                                className="group text-xs bg-card-border text-text-muted px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                            >
                                {tag.name}
                                <span className="ml-1 opacity-60 group-hover:opacity-100">({tag.count})</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Site Stats */}
            <div className="bg-card-bg rounded-xl shadow-sm p-6 animate-fade-in-up transition-colors" style={{ animationDelay: '0.4s' }}>
                <h3 className="font-bold mb-4 flex items-center gap-2 border-b border-card-border pb-2">
                    <FaHeart className="text-pink-500" /> 站点统计
                </h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3">
                        <div className="text-lg font-bold text-primary">{recentPosts?.count || 0}</div>
                        <div className="text-xs text-text-muted">总文章数</div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 rounded-lg p-3">
                        <div className="text-lg font-bold text-pink-500">{categories?.length || 0}</div>
                        <div className="text-xs text-text-muted">分类</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-3">
                        <div className="text-lg font-bold text-green-500">{tags?.length || 0}</div>
                        <div className="text-xs text-text-muted">标签</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-lg p-3">
                        <div className="text-lg font-bold text-yellow-500">∞</div>
                        <div className="text-xs text-text-muted">运行天数</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};
