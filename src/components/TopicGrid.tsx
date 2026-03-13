import Link from 'next/link';
import type { Category } from '@/shared/api/category';
import { buildTopicCards } from '@/shared/utils/topicCards';

interface TopicGridProps {
    categories: Category[];
}

export function TopicGrid({ categories }: TopicGridProps) {
    const topicCards = buildTopicCards(categories, 6);

    if (topicCards.length === 0) {
        return null;
    }

    return (
        <section id="topics" className="space-y-6">
            <div>
                <p className="mb-2 text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                    Topics
                </p>
                <h2 className="text-3xl font-bold font-serif">专题导航</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-text-muted">
                    把零散文章按主题组织起来，不管你今天想看技术、生活还是读书，都能更快找到入口。
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {topicCards.map((topic) => {
                    return (
                        <Link
                            key={topic.rawName}
                            href={topic.href}
                            className="group rounded-3xl border border-card-border/80 bg-card-bg/70 p-6 shadow-sm transition-all motion-transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                        >
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold transition-colors group-hover:text-primary">
                                        {topic.displayName}
                                    </h3>
                                    <p className="mt-2 text-sm leading-7 text-text-muted">
                                        {topic.description}
                                    </p>
                                </div>
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                    {topic.count} 篇
                                </span>
                            </div>

                            <p className="mb-3 text-xs leading-6 text-text-subtle">
                                {topic.note}
                            </p>

                            <div className="text-sm font-medium text-primary/80 transition-colors group-hover:text-primary">
                                进入专题 →
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
