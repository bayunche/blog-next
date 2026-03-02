import { MarkdownRenderer } from '@/shared/components/MarkdownRenderer';
import { FaCalendar, FaEye, FaComments, FaTags, FaEdit, FaClock, FaChevronLeft } from 'react-icons/fa';
import dayjs from 'dayjs';
import { articleApi } from '@/shared/api/article';
import { notFound } from 'next/navigation';
import Comments from '@/shared/components/Comments';
import { TableOfContents } from '@/components/TableOfContents';
import Link from 'next/link';
import { ArticleMusic } from '@/components/ArticleMusic';
import { buildBackgroundImageValue } from '@/shared/constants/backgrounds';

// 标记为动态渲染
export const dynamic = 'force-dynamic';

// Fetch data
async function getArticle(id: string) {
    try {
        const res = await articleApi.getDetail(id);
        return res;
    } catch (error) {
        console.error("Failed to fetch article:", error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} - Sakurairo Blog`,
        description: article.content.substring(0, 160),
        openGraph: {
            title: article.title,
            description: article.content.substring(0, 160),
            images: [article.cover || ''],
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    const bgImage = buildBackgroundImageValue(article.cover || undefined);
    const commentCount = (article.comments?.length || 0);
    const readingMinutes = Math.max(1, Math.round(String(article.content || '').replace(/\s+/g, '').length / 550));

    return (
        <div className="relative">
            {/* 同一张背景图贯穿标题区和内容区 */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: bgImage }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-background/90" />
            </div>

            <div className="relative z-10">
                <header className="relative min-h-[320px] md:min-h-[380px] flex items-end text-white overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent z-0" />

                    <div className="relative z-20 w-full max-w-6xl mx-auto px-4 pb-12 md:pb-14 space-y-5 animate-fade-in-up">
                        <Link
                            href="/posts"
                            className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white transition-colors"
                        >
                            <FaChevronLeft size={12} />
                            返回文章列表
                        </Link>

                        {article.category ? (
                            <div className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs tracking-wide backdrop-blur-md">
                                {article.category.name}
                            </div>
                        ) : null}

                        <h1 className="text-3xl md:text-5xl font-bold font-serif text-shadow-lg leading-tight max-w-4xl">
                            {article.title}
                        </h1>

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
                            <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-sm">
                                <FaComments /> {commentCount} 评论
                            </span>
                        </div>

                        {(article as any).musicId ? (
                            <ArticleMusic
                                musicId={(article as any).musicId}
                                musicName={(article as any).musicName || '未知音乐'}
                            />
                        ) : null}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
                        <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background opacity-40" />
                            <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-background" />
                        </svg>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-8 items-start">
                        <article className="min-w-0">
                            <section className="bg-card-bg/88 backdrop-blur-md rounded-3xl shadow-xl border border-card-border/80 p-5 sm:p-8 md:p-12 animate-fade-in-up">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-5 border-b border-card-border/80">
                                    <p className="text-sm text-text-muted">
                                        发布于 {dayjs(article.createdAt).format('YYYY-MM-DD HH:mm')}
                                    </p>
                                    <Link
                                        href={`/admin/articles/edit/${id}`}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <FaEdit /> 编辑文章
                                    </Link>
                                </div>

                                <div id="article-content">
                                    <MarkdownRenderer content={article.content} />
                                </div>

                                <div className="mt-10 pt-6 border-t border-card-border/80 flex flex-wrap items-center gap-3">
                                    <FaTags className="text-text-muted" />
                                    {(article.tags || []).map(tag => (
                                        <Link
                                            key={tag.name}
                                            href={`/tags/${encodeURIComponent(tag.name)}`}
                                            prefetch={false}
                                            className="bg-card-border hover:bg-primary hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-10 pt-8 border-t border-card-border/80">
                                    <Comments />
                                </div>
                            </section>
                        </article>

                        <aside className="hidden lg:block">
                            <div className="sticky top-24 space-y-4">
                                <TableOfContents content={article.content} />
                            </div>
                        </aside>
                    </div>
                </main>

                <div className="lg:hidden">
                    <TableOfContents content={article.content} />
                </div>
            </div>
        </div>
    );
}
