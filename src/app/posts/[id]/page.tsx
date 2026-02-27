import { MarkdownRenderer } from '@/shared/components/MarkdownRenderer';
import { FaCalendar, FaFolder, FaEye, FaComments, FaTags, FaEdit } from 'react-icons/fa';
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

    return (
        <div className="relative">
            {/* 同一张背景图贯穿标题区和内容区 */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: bgImage }} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-background/90" />
            </div>

            <div className="relative z-10">
            <header className="relative h-[50vh] min-h-[300px] flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent z-0" />

                {/* Content */}
                <div className="relative z-20 text-center px-4 max-w-4xl space-y-4 animate-fade-in-up">
                    {article.category && (
                        <div className="text-primary font-medium tracking-wide uppercase bg-white/20 px-3 py-1 rounded inline-block backdrop-blur-md">
                            {article.category.name}
                        </div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-bold font-serif text-shadow-lg leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm md:text-base opacity-90">
                        <span className="flex items-center gap-2"><FaCalendar /> {dayjs(article.createdAt).format('YYYY-MM-DD')}</span>
                        <span className="flex items-center gap-2"><FaEye /> {article.viewCount || 0} 阅读</span>
                        <span className="flex items-center gap-2"><FaComments /> {commentCount} 评论</span>
                    </div>

                    {/* Article Music Sync Button */}
                    {(article as any).musicId && (
                        <ArticleMusic
                            musicId={(article as any).musicId}
                            musicName={(article as any).musicName || '未知音乐'}
                        />
                    )}
                </div>

                {/* Wave at bottom */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
                    <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-background opacity-40" />
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-background" />
                    </svg>
                </div>
            </header>

            {/* Main Content with TOC Sidebar */}
            <main className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="flex gap-8">
                    {/* Article Content */}
                    <article className="flex-1 min-w-0">
                        <div className="bg-card-bg/80 backdrop-blur-sm rounded-2xl shadow-md border border-card-border p-6 md:p-12 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            {/* 编辑按钮 - 仅管理员可见 */}
                            <div className="flex justify-end mb-4">
                                <Link
                                    href={`/admin/articles/edit/${id}`}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                >
                                    <FaEdit /> 编辑文章
                                </Link>
                            </div>

                            {/* Markdown 内容 */}
                            <div id="article-content">
                                <MarkdownRenderer content={article.content} />
                            </div>

                            {/* 标签 */}
                            <div className="mt-12 pt-8 border-t border-card-border flex flex-wrap gap-3">
                                <FaTags className="text-text-muted mt-1" />
                                {(article.tags || []).map(tag => (
                                    <Link
                                        key={tag.name}
                                        href={`/tags/${encodeURIComponent(tag.name)}`}
                                        className="bg-card-border hover:bg-primary hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>

                            {/* 评论区 */}
                            <Comments />
                        </div>

                        {/* 打赏按钮 */}
                        <div className="text-center mb-16">
                            <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                                ☕ 打赏作者
                            </button>
                        </div>
                    </article>

                    {/* 右侧 TOC */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <TableOfContents content={article.content} />
                        </div>
                    </aside>
                </div>
            </main>

            {/* 移动端悬浮 TOC */}
            <div className="lg:hidden">
                <TableOfContents content={article.content} />
            </div>
            </div>
        </div>
    );
}
