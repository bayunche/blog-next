import Link from 'next/link';
import dayjs from 'dayjs';
import type { Article } from '@/shared/api/article';

interface PostNavigatorProps {
    previous?: Article;
    next?: Article;
}

function NavigatorItem({
    label,
    article,
    align = 'left',
}: {
    label: string;
    article?: Article;
    align?: 'left' | 'right';
}) {
    if (!article) {
        return (
            <div className="rounded-3xl border border-dashed border-card-border bg-card-bg/50 p-5 text-sm text-text-muted">
                {align === 'left' ? '已经是第一篇了。' : '已经是最后一篇了。'}
            </div>
        );
    }

    return (
        <Link
            href={`/posts/${article.id}`}
            className="group block rounded-3xl border border-card-border/80 bg-card-bg/80 p-5 shadow-sm transition-all motion-transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
        >
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
                {label}
            </p>
            <h3 className="mt-3 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
                {article.title}
            </h3>
            <p className="mt-2 text-sm text-text-muted">
                {dayjs(article.createdAt).format('YYYY-MM-DD')}
            </p>
        </Link>
    );
}

export function PostNavigator({ previous, next }: PostNavigatorProps) {
    return (
        <section className="grid gap-4 md:grid-cols-2">
            <NavigatorItem label="上一篇" article={previous} align="left" />
            <NavigatorItem label="下一篇" article={next} align="right" />
        </section>
    );
}
