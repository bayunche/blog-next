import Link from 'next/link';
import dayjs from 'dayjs';
import { notFound } from 'next/navigation';
import { FaCalendar, FaChevronLeft, FaClock, FaComments, FaEye, FaTags } from 'react-icons/fa';
import { ArticleMusic } from '@/components/ArticleMusic';
import { AuthorCard } from '@/components/AuthorCard';
import { PostNavigator } from '@/components/PostNavigator';
import { RelatedPosts } from '@/components/RelatedPosts';
import { TableOfContents } from '@/components/TableOfContents';
import { articleApi, Article } from '@/shared/api/article';
import Comments from '@/shared/components/Comments';
import { MarkdownRenderer } from '@/shared/components/MarkdownRenderer';
import { buildBackgroundImageValue } from '@/shared/constants/backgrounds';
import { siteProfile } from '@/shared/constants/siteProfile';
import { getArticleExcerpt } from '@/shared/utils/getArticleExcerpt';
import {
    estimateReadingMinutes,
    getDisplayCategoryName,
    shouldShowCommentCount,
} from '@/shared/utils/articleDisplay';

export const dynamic = 'force-dynamic';

async function getArticle(id: string) {
    try {
        return await articleApi.getDetail(id);
    } catch (error) {
        console.error('Failed to fetch article:', error);
        return null;
    }
}

async function getCompanionArticles() {
    try {
        const result = await articleApi.getList({ page: 1, pageSize: 100, preview: 1, type: true });
        return result.rows || [];
    } catch (error) {
        console.error('Failed to fetch companion articles:', error);
        return [] as Article[];
    }
}

function buildRelatedPosts(currentArticle: Article, allArticles: Article[]) {
    const currentCategory = currentArticle.category?.name || currentArticle.categories?.[0]?.name;
    const currentTags = new Set((currentArticle.tags || []).map((tag) => tag.name));

    return allArticles
        .filter((article) => article.id !== currentArticle.id)
        .map((article) => {
            const sharedTags = (article.tags || []).filter((tag) => currentTags.has(tag.name)).length;
            const sameCategory = currentCategory && (article.category?.name || article.categories?.[0]?.name) === currentCategory;
            const score = (sameCategory ? 4 : 0) + sharedTags * 2 + Math.min(article.viewCount || 0, 50) / 50;

            return { article, score };
        })
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, 4)
        .map((item) => item.article);
}

function buildNavigator(currentArticle: Article, allArticles: Article[]) {
    const ordered = [...allArticles].sort(
        (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
    );
    const currentIndex = ordered.findIndex((article) => article.id === currentArticle.id);

    return {
        previous: currentIndex > 0 ? ordered[currentIndex - 1] : undefined,
        next: currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : undefined,
    };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        return { title: 'Article Not Found' };
    }

    const excerpt = getArticleExcerpt(article.content, 160);

    return {
        title: `${article.title} - ${siteProfile.siteName}`,
        description: excerpt,
        openGraph: {
            title: article.title,
            description: excerpt,
            images: [article.cover || ''],
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [article, companionArticles] = await Promise.all([getArticle(id), getCompanionArticles()]);

    if (!article) {
        notFound();
    }

    const bgImage = buildBackgroundImageValue(article.cover || undefined);
    const commentCount = article.comments?.length || 0;
    const readingMinutes = estimateReadingMinutes(article.content || '');
    const displayCategoryName = getDisplayCategoryName(article.category || article.categories?.[0]);
    const relatedPosts = buildRelatedPosts(article, companionArticles);
    const { previous, next } = buildNavigator(article, companionArticles);
    const excerpt = getArticleExcerpt(article.content, 120);
    const articleWithMusic = article as Article & { musicId?: string; musicName?: string };

    return (
        <div className="relative">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: bgImage }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-background/90" />
            </div>

            <div className="relative z-10">
                <header className="relative flex min-h-[300px] items-end overflow-hidden text-white md:min-h-[400px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent z-0" />

                    <div className="relative z-20 mx-auto w-full max-w-6xl space-y-5 px-4 pb-10 md:pb-14">
                        <Link
                            href="/posts"
                            className="inline-flex items-center gap-2 text-sm text-white/85 transition-colors hover:text-white"
                        >
                            <FaChevronLeft size={12} />
                            返回文章列表
                        </Link>

                        <div className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs tracking-wide backdrop-blur-md">
                            {displayCategoryName}
                        </div>

                        <div className="space-y-4 max-w-4xl">
                            <h1 className="text-2xl font-bold font-serif leading-tight sm:text-3xl md:text-5xl">
                                {article.title}
                            </h1>
                            <p className="text-sm leading-7 text-white/75 md:text-base">
                                {excerpt}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                            <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
                                <FaCalendar /> {dayjs(article.createdAt).format('YYYY-MM-DD')}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
                                <FaClock /> 约 {readingMinutes} 分钟
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
                                <FaEye /> {article.viewCount || 0} 阅读
                            </span>
                            {shouldShowCommentCount(commentCount) ? (
                                <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
                                    <FaComments /> {commentCount} 评论
                                </span>
                            ) : null}
                        </div>

                        {articleWithMusic.musicId ? (
                            <ArticleMusic
                                musicId={articleWithMusic.musicId}
                                musicName={articleWithMusic.musicName || '未知音乐'}
                            />
                        ) : null}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
                        <svg className="relative block h-[60px] w-[calc(100%+1.3px)] md:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background opacity-40" />
                            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-background" />
                        </svg>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 md:py-12">
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
                        <article className="min-w-0 space-y-8">
                            <section className="rounded-3xl border border-card-border/80 bg-card-bg/88 p-4 shadow-xl backdrop-blur-md sm:p-8 md:p-12">
                                <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-card-border/80 pb-5 text-sm text-text-muted">
                                    <p>发布于 {dayjs(article.createdAt).format('YYYY-MM-DD HH:mm')}</p>
                                    <span>·</span>
                                    <p>作者：{siteProfile.author.shortName}</p>
                                </div>

                                <div id="article-content">
                                    <MarkdownRenderer content={article.content} />
                                </div>

                                {(article.tags || []).length > 0 ? (
                                    <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-card-border/80 pt-6">
                                        <FaTags className="text-text-muted" />
                                        {(article.tags || []).map((tag) => (
                                            <Link
                                                key={tag.name}
                                                href={`/tags/${encodeURIComponent(tag.name)}`}
                                                prefetch={false}
                                                className="rounded-full bg-card-border px-3 py-1 text-sm transition-colors hover:bg-primary hover:text-white"
                                            >
                                                #{tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </section>

                            <AuthorCard />
                            <RelatedPosts posts={relatedPosts} />
                            <PostNavigator previous={previous} next={next} />

                            <section className="rounded-3xl border border-card-border/80 bg-card-bg/88 p-4 shadow-xl backdrop-blur-md sm:p-8">
                                <div className="mb-6 border-b border-card-border/80 pb-4">
                                    <h2 className="text-2xl font-bold font-serif">评论区</h2>
                                    <p className="mt-2 text-sm text-text-muted">
                                        读完这篇文章后，如果你也有类似经验或不同看法，欢迎继续交流。
                                    </p>
                                </div>
                                <Comments />
                            </section>
                        </article>

                        <aside className="hidden lg:block">
                            <div className="sticky top-24 space-y-4">
                                <TableOfContents content={article.content} />
                            </div>
                        </aside>
                    </div>
                </main>

                <div className="px-4 pb-[calc(env(safe-area-inset-bottom)+7rem)] lg:hidden">
                    <TableOfContents content={article.content} />
                </div>
            </div>
        </div>
    );
}
