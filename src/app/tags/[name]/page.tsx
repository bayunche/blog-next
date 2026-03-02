import Link from 'next/link';
import { FaChevronLeft, FaTags } from 'react-icons/fa';
import { ArticleCard } from '@/features/article/components/ArticleCard';
import { articleApi, Article } from '@/shared/api/article';

export const dynamic = 'force-dynamic';

function decodeTagName(value: string) {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

async function getArticlesByTag(tagName: string) {
    try {
        return await articleApi.getList({
            page: 1,
            pageSize: 50,
            tag: tagName,
            preview: 1,
        });
    } catch (error) {
        console.error('Failed to fetch tag articles:', error);
        return { rows: [], count: 0 };
    }
}

export default async function TagPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const tagName = decodeTagName(name);
    const result = await getArticlesByTag(tagName);
    const articles = result.rows || [];

    return (
        <div className="min-h-screen pt-20 pb-16">
            <div className="bg-gradient-to-br from-green-100/30 via-white to-primary/10 dark:from-gray-900/20 dark:via-gray-900/10 dark:to-primary/10 py-16">
                <div className="container mx-auto px-4 max-w-5xl space-y-4">
                    <Link
                        href="/posts"
                        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
                    >
                        <FaChevronLeft size={12} />
                        返回文章列表
                    </Link>
                    <h1 className="text-4xl font-bold font-serif flex items-center gap-3">
                        <FaTags className="text-green-500" />
                        标签：#{tagName}
                    </h1>
                    <p className="text-text-muted">
                        共找到 {result.count || 0} 篇相关文章
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                {articles.length > 0 ? (
                    <div className="space-y-8">
                        {articles.map((article: Article, index: number) => (
                            <ArticleCard
                                key={article.id}
                                id={article.id}
                                title={article.title}
                                summary={String(article.content || '').substring(0, 150) + '...'}
                                cover={article.cover}
                                createdAt={article.createdAt}
                                category={article.category || article.categories?.[0]}
                                tags={article.tags}
                                index={index}
                                viewCount={article.viewCount}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏷️</div>
                        <h3 className="text-xl font-bold mb-2">这个标签下还没有文章</h3>
                        <p className="text-text-muted">试试其他标签，或者返回文章列表看看最新内容。</p>
                    </div>
                )}
            </div>
        </div>
    );
}
