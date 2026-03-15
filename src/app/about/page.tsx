import Image from 'next/image';
import Link from 'next/link';
import { FaCode, FaGithub, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { articleApi } from '@/shared/api/article';
import { siteProfile } from '@/shared/constants/siteProfile';
import { getArticleExcerpt } from '@/shared/utils/getArticleExcerpt';

export const dynamic = 'force-dynamic';

async function getRepresentativePosts() {
    try {
        const result = await articleApi.getList({ page: 1, pageSize: 12, preview: 1, type: true });
        return [...(result.rows || [])]
            .sort((left, right) => (right.viewCount || 0) - (left.viewCount || 0))
            .slice(0, 3);
    } catch (error) {
        console.error('Failed to fetch representative posts:', error);
        return [];
    }
}

export default async function AboutPage() {
    const representativePosts = await getRepresentativePosts();

    return (
        <div className="min-h-screen pt-20">
            <div className="absolute left-0 right-0 top-0 -z-10 h-96 bg-gradient-to-br from-primary/20 via-pink-200/30 to-purple-200/20 dark:from-primary/10 dark:via-purple-900/20 dark:to-transparent" />

            <div className="container mx-auto max-w-6xl px-4 py-12 space-y-10">
                <section className="rounded-[2rem] border border-card-border bg-card-bg/85 p-5 shadow-xl backdrop-blur-sm sm:p-8 md:p-10">
                    <div className="flex flex-col gap-8 md:flex-row md:items-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl dark:border-gray-700">
                            <Image
                                src={siteProfile.author.avatar}
                                alt={siteProfile.author.shortName}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-4">
                            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                                About Me
                            </p>
                            <div>
                                <h1 className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-2xl font-bold font-serif text-transparent sm:text-3xl md:text-4xl">
                                    {siteProfile.author.name}
                                </h1>
                                <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
                                    <FaMapMarkerAlt className="text-primary" />
                                    <span>{siteProfile.author.location}</span>
                                </p>
                            </div>

                            <p className="max-w-3xl text-sm leading-8 text-text-muted">
                                {siteProfile.author.bio}
                            </p>
                            <p className="max-w-3xl text-sm leading-8 text-text-muted">
                                我希望博客里既有“怎么解决问题”的部分，也有“最近是怎么生活、怎么读书、怎么慢慢想明白一些事”的部分。
                                如果它最后像一本持续更新的个人手记，我会很开心。
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={siteProfile.socialLinks[0].href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                                >
                                    <FaGithub size={14} />
                                    GitHub
                                </a>
                                <Link
                                    href="/posts"
                                    className="rounded-full border border-card-border px-5 py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary/30 hover:text-primary"
                                >
                                    浏览文章
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    <div className="rounded-[2rem] border border-card-border bg-card-bg/85 p-5 shadow-sm backdrop-blur-sm sm:p-8">
                        <h2 className="flex items-center gap-3 text-xl font-bold font-serif sm:text-2xl">
                            <FaCode className="text-primary" />
                            我会写什么
                        </h2>
                        <p className="mt-4 text-sm leading-8 text-text-muted">
                            这里当然会有技术内容，但也不会把自己限制成“只输出干货”的样子。
                            我想把人真实在意的东西都慢慢放进来：工作、阅读、生活、情绪，以及阶段性的变化。
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            {siteProfile.capabilityTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-card-border px-4 py-2 text-sm text-text-muted"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-8 grid gap-4 md:grid-cols-2">
                            {siteProfile.writingDimensions.map((item) => (
                                <div key={item.title} className="rounded-3xl border border-card-border/70 bg-background/50 p-5">
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
                                className="rounded-[2rem] border border-card-border bg-card-bg/85 p-6 shadow-sm backdrop-blur-sm"
                            >
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-text-muted">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[2rem] border border-card-border bg-card-bg/85 p-5 shadow-sm backdrop-blur-sm sm:p-8">
                    <h2 className="text-xl font-bold font-serif sm:text-2xl">写作之外</h2>
                    <p className="mt-4 max-w-3xl text-sm leading-8 text-text-muted">
                        除了工作和技术，我也想保留一些“不必证明价值”的内容：最近读到的句子、一次散步后的情绪、某段时间的节奏变化，或者只是一个普通却想记住的夜晚。
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {siteProfile.currentFocus.map((item) => (
                            <div key={item.title} className="rounded-3xl border border-card-border/70 bg-background/50 p-5">
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="mt-3 text-sm leading-7 text-text-muted">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[2rem] border border-card-border bg-card-bg/85 p-5 shadow-sm backdrop-blur-sm sm:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="flex items-center gap-3 text-xl font-bold font-serif sm:text-2xl">
                                <FaStar className="text-primary" />
                                代表作 / 建议先看
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-text-muted">
                                如果你想快速感受这里的内容质量和关注方向，可以先从下面几篇开始。
                            </p>
                        </div>
                        <Link href="/posts" className="text-sm font-medium text-primary hover:text-primary/80">
                            查看全部文章
                        </Link>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {representativePosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/posts/${post.id}`}
                                className="group rounded-3xl border border-card-border/80 bg-background/50 p-5 transition-all motion-transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                            >
                                <h3 className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
                                    {post.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-text-muted line-clamp-3">
                                    {getArticleExcerpt(post.content, 110)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
