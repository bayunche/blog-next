import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import type { Article } from '@/shared/api/article';
import { ArticleCard } from '@/features/article/components/ArticleCard';
import { getArticleExcerpt } from '@/shared/utils/getArticleExcerpt';
import { estimateReadingMinutes } from '@/shared/utils/articleDisplay';

interface FeaturedPostsProps {
    posts: Article[];
}

export function FeaturedPosts({ posts }: FeaturedPostsProps) {
    if (posts.length === 0) {
        return null;
    }

    return (
        <section id="featured" className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="mb-2 text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                        Start Here
                    </p>
                    <h2 className="text-3xl font-bold font-serif">推荐阅读</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-text-muted">
                        如果你是第一次来到这里，可以先从这几篇文章开始，更快了解我在技术、阅读和日常表达上的关注方向。
                    </p>
                </div>
                <Link
                    href="/posts"
                    className="inline-flex self-start items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                    查看全部文章
                    <FaArrowRight size={12} />
                </Link>
            </div>

            <div className="space-y-6">
                {posts.map((post, index) => (
                    <ArticleCard
                        key={post.id}
                        id={post.id}
                        title={post.title}
                        summary={getArticleExcerpt(post.content, index === 0 ? 180 : 140)}
                        content={post.content}
                        cover={post.cover}
                        createdAt={post.createdAt}
                        category={post.category || post.categories?.[0]}
                        tags={post.tags}
                        index={index}
                        viewCount={post.viewCount}
                        commentCount={post.comments?.length}
                        readingMinutes={estimateReadingMinutes(post.content)}
                        variant={index === 0 ? 'featured' : 'default'}
                        featured={index === 0}
                        articleType={index === 0 ? '代表作' : '推荐'}
                    />
                ))}
            </div>
        </section>
    );
}
