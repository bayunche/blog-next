import Link from 'next/link';
import dayjs from 'dayjs';
import { FaArrowRight } from 'react-icons/fa';
import type { Article } from '@/shared/api/article';
import { getArticleExcerpt } from '@/shared/utils/getArticleExcerpt';
import { getDisplayCategoryName } from '@/shared/utils/articleDisplay';

interface RelatedPostsProps {
    posts: Article[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                        Continue Reading
                    </p>
                    <h2 className="text-2xl font-bold font-serif">相关文章</h2>
                </div>
                <Link
                    href="/posts"
                    className="inline-flex self-start items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                    更多文章
                    <FaArrowRight size={12} />
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-card-border bg-card-bg/60 p-6 text-sm leading-7 text-text-muted">
                    还没有找到足够相关的文章，先去文章列表看看最近更新吧。
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/posts/${post.id}`}
                            className="group rounded-3xl border border-card-border/80 bg-card-bg/80 p-6 shadow-sm transition-all motion-transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                        >
                            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                                    {getDisplayCategoryName(post.category || post.categories?.[0])}
                                </span>
                                <span>{dayjs(post.createdAt).format('YYYY-MM-DD')}</span>
                            </div>
                            <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                                {post.title}
                            </h3>
                            <p className="mt-3 text-sm leading-7 text-text-muted line-clamp-3">
                                {getArticleExcerpt(post.content, 110)}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
