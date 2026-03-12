import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { Sidebar } from '@/components/Sidebar';
import { FeaturedPosts } from '@/components/FeaturedPosts';
import { TopicGrid } from '@/components/TopicGrid';
import { ArticleCard } from '@/features/article/components/ArticleCard';
import { articleApi, Article } from '@/shared/api/article';
import { categoryApi, Category } from '@/shared/api/category';
import { siteProfile } from '@/shared/constants/siteProfile';
import { getArticleExcerpt } from '@/shared/utils/getArticleExcerpt';
import { estimateReadingMinutes } from '@/shared/utils/articleDisplay';

export const dynamic = 'force-dynamic';

async function getHomeData(): Promise<{ posts: Article[]; categories: Category[] }> {
    try {
        const [articleRes, categories] = await Promise.all([
            articleApi.getList({ page: 1, pageSize: 12, preview: 1 }),
            categoryApi.getList(),
        ]);

        return {
            posts: articleRes.rows || [],
            categories: categories || [],
        };
    } catch (error) {
        console.error('Failed to fetch home data:', error);
        return {
            posts: [],
            categories: [],
        };
    }
}

function buildFeaturedPosts(posts: Article[]) {
    return [...posts]
        .sort((left, right) => {
            if ((right.viewCount || 0) !== (left.viewCount || 0)) {
                return (right.viewCount || 0) - (left.viewCount || 0);
            }

            return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        })
        .slice(0, 3);
}

function buildRecentPosts(posts: Article[], featuredIds: Set<number>) {
    const filtered = posts.filter((post) => !featuredIds.has(post.id));
    return (filtered.length > 0 ? filtered : posts).slice(0, 4);
}

export default async function Home() {
    const { posts, categories } = await getHomeData();
    const featuredPosts = buildFeaturedPosts(posts);
    const featuredIds = new Set(featuredPosts.map((post) => post.id));
    const recentPosts = buildRecentPosts(posts, featuredIds);

    return (
        <>
            <Hero />

            <div className="container mx-auto max-w-7xl space-y-20 px-4 py-16">
                <FeaturedPosts posts={featuredPosts} />

                <TopicGrid categories={categories} />

                <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    <div className="rounded-[2rem] border border-card-border/80 bg-card-bg/80 p-8 shadow-sm backdrop-blur-sm">
                        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                            Writing Range
                        </p>
                        <h2 className="mt-3 text-3xl font-bold font-serif">这里不只写技术</h2>
                        <p className="mt-4 max-w-3xl text-sm leading-8 text-text-muted">
                            我希望这个站点既能放下工作里的技术问题，也能放下读书后的触动、生活中的小事和一些没有完全想明白的想法。
                            它不一定总是“有用”，但会尽量保持真诚。
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {siteProfile.writingDimensions.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-3xl border border-card-border/70 bg-background/50 p-5"
                                >
                                    <h3 className="text-lg font-semibold">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-text-muted">
                                        {item.description}
                                    </p>
                                    <p className="mt-3 text-xs leading-6 text-text-subtle">
                                        {item.note}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {siteProfile.currentMoments.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-[2rem] border border-card-border/80 bg-card-bg/80 p-6 shadow-sm backdrop-blur-sm"
                            >
                                <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary/80">
                                    {item.title}
                                </p>
                                <p className="mt-3 text-sm leading-7 text-text-muted">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="latest" className="space-y-8">
                    <div className="space-y-3">
                        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                            Latest Posts
                        </p>
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h2 className="text-3xl font-bold font-serif">最新更新</h2>
                                <p className="mt-2 text-sm leading-7 text-text-muted">
                                    这里会混合出现技术笔记、读书心得、生活记录和日常随笔。
                                    你不必先决定自己想看哪一类，先挑一篇当下愿意点开的就好。
                                </p>
                            </div>
                            <Link
                                href="/posts"
                                className="inline-flex items-center justify-center rounded-full border border-primary/20 px-5 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                            >
                                查看全部文章
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 xl:flex-row">
                        <div className="flex-1 space-y-8">
                            {recentPosts.length > 0 ? (
                                recentPosts.map((post, index) => (
                                    <ArticleCard
                                        key={post.id}
                                        id={post.id}
                                        title={post.title}
                                        summary={getArticleExcerpt(post.content, 150)}
                                        content={post.content}
                                        cover={post.cover}
                                        createdAt={post.createdAt}
                                        category={post.category || post.categories?.[0]}
                                        tags={post.tags || []}
                                        index={index}
                                        viewCount={post.viewCount}
                                        commentCount={post.comments?.length || 0}
                                        readingMinutes={estimateReadingMinutes(post.content)}
                                    />
                                ))
                            ) : (
                                <div className="rounded-3xl border border-dashed border-card-border bg-card-bg/70 p-10 text-center text-text-muted">
                                    文章还在整理中，稍后这里会出现新的内容。
                                </div>
                            )}
                        </div>

                        <div className="hidden xl:block">
                            <Sidebar />
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
                    <div className="rounded-[2rem] border border-card-border/80 bg-card-bg/80 p-8 shadow-sm backdrop-blur-sm">
                        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                            About This Blog
                        </p>
                        <h2 className="mt-3 text-3xl font-bold font-serif">这是一个怎样的博客？</h2>
                        <p className="mt-4 text-sm leading-8 text-text-muted">
                            {siteProfile.description}
                        </p>
                        <p className="mt-4 text-sm leading-8 text-text-muted">
                            如果说技术文章是在整理我如何工作，那读书、生活和日常随笔，更像是在整理我如何成为现在这个人。
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/about"
                                className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                            >
                                认识作者
                            </Link>
                            <Link
                                href="/posts"
                                className="rounded-full border border-card-border px-5 py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary/30 hover:text-primary"
                            >
                                浏览全部文章
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {siteProfile.currentFocus.map((item) => (
                            <div
                                key={item.title}
                                className="rounded-[2rem] border border-card-border/80 bg-card-bg/80 p-6 shadow-sm backdrop-blur-sm"
                            >
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-text-muted">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
