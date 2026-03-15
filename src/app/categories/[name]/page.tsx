import Link from 'next/link';
import { FaChevronLeft, FaFolderOpen } from 'react-icons/fa';
import { ArticleCard } from '@/features/article/components/ArticleCard';
import { Article } from '@/shared/api/article';
import { categoryApi } from '@/shared/api/category';
import { getCategoryMeta } from '@/shared/constants/categoryMeta';
import { getArticleExcerpt } from '@/shared/utils/getArticleExcerpt';
import { estimateReadingMinutes, getDisplayCategoryName } from '@/shared/utils/articleDisplay';

export const dynamic = 'force-dynamic';

function decodeCategoryName(value: string) {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}

async function getCategoryPageData(categoryName: string) {
    try {
        return await categoryApi.getPublicDetail(categoryName, {
            page: 1,
            pageSize: 50,
            preview: 1,
        });
    } catch (error) {
        console.error('Failed to fetch category page data:', error);
        return {
            category: { name: categoryName, displayName: categoryName, isUncategorized: false },
            rows: [],
            count: 0,
            relatedTags: [],
        };
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    const categoryName = decodeCategoryName(name);
    const result = await getCategoryPageData(categoryName);
    const canonicalCategoryName = result.category?.displayName || categoryName;
    const displayCategoryName = getDisplayCategoryName(canonicalCategoryName);
    const categoryMeta = getCategoryMeta(canonicalCategoryName);
    const articles = result.rows || [];
    const featuredArticle = articles[0];
    const relatedTags = result.relatedTags || [];

    return (
        <div className="min-h-screen pb-12 pt-20 md:pb-16">
            <div className={`bg-gradient-to-br ${categoryMeta.accentClass} py-14 sm:py-16`}>
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
                            Topic Page
                        </p>
                        <h1 className="flex items-center gap-3 text-3xl font-bold font-serif sm:text-4xl">
                            <FaFolderOpen className="text-yellow-500" />
                            {displayCategoryName}
                        </h1>
                        <p className="max-w-3xl text-sm leading-7 text-text-muted">
                            {categoryMeta.description}
                        </p>
                        <p className="text-sm text-text-muted">
                            {categoryMeta.note} · 当前共 <span className="font-medium text-primary">{result.count || 0}</span> 篇文章
                        </p>
                    </div>

                    {relatedTags.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            <span className="text-sm text-text-muted">相关标签：</span>
                            {relatedTags.map((tag) => (
                                <Link
                                    key={tag.name}
                                    href={`/tags/${encodeURIComponent(tag.name)}`}
                                    className="rounded-full border border-card-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-primary/30 hover:text-primary"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    ) : null}

                    {featuredArticle ? (
                        <div className="rounded-[2rem] border border-card-border/80 bg-card-bg/75 p-5 shadow-sm backdrop-blur-sm sm:p-6">
                            <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
                                推荐先看
                            </p>
                            <h2 className="mt-3 text-2xl font-bold font-serif">{featuredArticle.title}</h2>
                            <p className="mt-3 text-sm leading-7 text-text-muted">
                                {getArticleExcerpt(featuredArticle.content, 140)}
                            </p>
                            <Link
                                href={`/posts/${featuredArticle.id}`}
                                className="mt-5 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                            >
                                进入这篇文章
                            </Link>
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
                                cover={article.cardCover || article.cover}
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
                    <div className="rounded-3xl border border-dashed border-card-border bg-card-bg/70 px-6 py-12 text-center sm:py-16">
                        <div className="mb-4 text-6xl">📁</div>
                        <h3 className="mb-2 text-xl font-bold">这个专题下还没有文章</h3>
                        <p className="text-text-muted">可以先返回文章列表，或者看看首页的推荐阅读。</p>
                    </div>
                )}
            </div>
        </div>
    );
}
