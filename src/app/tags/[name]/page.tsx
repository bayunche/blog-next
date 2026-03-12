import Link from 'next/link';
import { FaChevronLeft, FaTags } from 'react-icons/fa';
import { ArticleCard } from '@/features/article/components/ArticleCard';
import { articleApi, Article } from '@/shared/api/article';
import { getTagMeta } from '@/shared/constants/tagMeta';
import { getArticleExcerpt } from '@/shared/utils/getArticleExcerpt';
import { estimateReadingMinutes } from '@/shared/utils/articleDisplay';

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
    const tagMeta = getTagMeta(tagName);

    return (
        <div className="min-h-screen pb-16 pt-20">
            <div className="bg-gradient-to-br from-green-100/30 via-white to-primary/10 py-16 dark:from-gray-900/20 dark:via-gray-900/10 dark:to-primary/10">
                <div className="container mx-auto max-w-6xl px-4 space-y-6">
                    <Link
                        href="/posts"
                        className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-primary"
                    >
                        <FaChevronLeft size={12} />
                        返回文章列表
                    </Link>

                    <div className="space-y-4">
                        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                            Keyword Collection
                        </p>
                        <h1 className="flex items-center gap-3 text-4xl font-bold font-serif">
                            <FaTags className="text-green-500" />
                            #{tagName}
                        </h1>
                        <p className="max-w-3xl text-sm leading-7 text-text-muted">
                            {tagMeta.description}
                        </p>
                        <p className="text-sm text-text-muted">
                            共找到 <span className="font-medium text-primary">{result.count || 0}</span> 篇相关文章
                        </p>
                    </div>

                    {tagMeta.relatedTags.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            <span className="text-sm text-text-muted">相关标签：</span>
                            {tagMeta.relatedTags.map((relatedTag) => (
                                <Link
                                    key={relatedTag}
                                    href={`/tags/${encodeURIComponent(relatedTag)}`}
                                    className="rounded-full border border-card-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-primary/30 hover:text-primary"
                                >
                                    #{relatedTag}
                                </Link>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="container mx-auto max-w-6xl px-4 py-12">
                {articles.length > 0 ? (
                    <div className="space-y-8">
                        {articles.map((article: Article, index: number) => (
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
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-card-border bg-card-bg/70 px-6 py-16 text-center">
                        <div className="mb-4 text-6xl">🏷️</div>
                        <h3 className="text-xl font-bold mb-2">这个标签下还没有文章</h3>
                        <p className="text-text-muted">试试相关标签，或者先去首页看看推荐阅读。</p>
                    </div>
                )}
            </div>
        </div>
    );
}
