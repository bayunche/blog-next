import Image from 'next/image';
import Link from 'next/link';
import dayjs from 'dayjs';
import { FaArrowRight, FaCalendar, FaClock, FaComment, FaFire } from 'react-icons/fa';
import {
    estimateReadingMinutes,
    getDisplayCategoryName,
    shouldShowCommentCount,
} from '@/shared/utils/articleDisplay';

type CardVariant = 'default' | 'featured';

interface ArticleCardProps {
    id: number;
    title: string;
    summary: string;
    content?: string;
    cover?: string;
    createdAt: string;
    category?: { name: string } | null;
    tags?: { name: string }[];
    index?: number;
    viewCount?: number;
    commentCount?: number;
    readingMinutes?: number;
    variant?: CardVariant;
    featured?: boolean;
    articleType?: string;
    hideZeroComment?: boolean;
}

export const ArticleCard = ({
    id,
    title,
    summary,
    content = '',
    cover,
    createdAt,
    category,
    tags = [],
    index = 0,
    viewCount = 0,
    commentCount = 0,
    readingMinutes,
    variant = 'default',
    featured = false,
    articleType,
    hideZeroComment = true,
}: ArticleCardProps) => {
    const isFeatured = featured || variant === 'featured';
    const isReversed = !isFeatured && index % 2 === 1;
    const displayCategoryName = getDisplayCategoryName(category);
    const visibleReadingMinutes = readingMinutes ?? estimateReadingMinutes(content || summary);
    const showCommentCount = hideZeroComment ? shouldShowCommentCount(commentCount) : true;
    const rawCategoryName = category?.name || displayCategoryName;

    return (
        <article
            className={[
                'group relative overflow-hidden rounded-3xl border border-card-border/70 bg-card-bg/85 backdrop-blur-sm shadow-md transition-all motion-transition-slow hover:-translate-y-1 hover:shadow-2xl',
                isFeatured ? 'grid gap-0 lg:grid-cols-[1.15fr_1fr]' : `flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}`,
            ].join(' ')}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className={isFeatured ? 'relative min-h-[280px] lg:min-h-[360px]' : 'relative h-56 w-full overflow-hidden md:h-[320px] md:w-1/2'}>
                <Link href={`/posts/${id}`} className="block h-full w-full">
                    <Image
                        src={cover || '/images/background.jpg'}
                        alt={title}
                        fill
                        className="object-cover transition-transform motion-transition-slow group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                </Link>

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <Link
                        href={`/categories/${encodeURIComponent(rawCategoryName)}`}
                        prefetch={false}
                        className="rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-primary"
                    >
                        {displayCategoryName}
                    </Link>
                    {articleType ? (
                        <span className="rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {articleType}
                        </span>
                    ) : null}
                    {isFeatured ? (
                        <span className="rounded-full bg-amber-400/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                            推荐阅读
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="relative flex flex-1 flex-col justify-center p-6 md:p-8">
                <div className={`absolute top-0 ${isReversed ? 'right-0' : 'left-0'} h-full w-1 bg-gradient-to-b from-primary via-pink-400 to-purple-500 opacity-0 transition-opacity motion-transition group-hover:opacity-100`} />

                <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-text-muted">
                    <span className="inline-flex items-center gap-1.5">
                        <FaCalendar className="text-primary" />
                        {dayjs(createdAt).format('YYYY年M月D日')}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <FaClock className="text-primary" />
                        {visibleReadingMinutes} 分钟
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <FaFire className="text-primary" />
                        {viewCount} 热度
                    </span>
                    {showCommentCount ? (
                        <span className="inline-flex items-center gap-1.5">
                            <FaComment className="text-text-muted" />
                            {commentCount} 评论
                        </span>
                    ) : null}
                </div>

                <h2 className={`mb-4 font-bold transition-colors motion-transition group-hover:text-primary ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
                    <Link href={`/posts/${id}`}>{title}</Link>
                </h2>

                <p className={`mb-6 text-sm leading-relaxed text-text-muted ${isFeatured ? 'line-clamp-4' : 'line-clamp-3'}`}>
                    {summary}
                </p>

                {tags.length > 0 ? (
                    <div className="mb-5 flex flex-wrap gap-2">
                        {tags.slice(0, isFeatured ? 4 : 3).map((tag) => (
                            <Link
                                key={tag.name}
                                href={`/tags/${encodeURIComponent(tag.name)}`}
                                prefetch={false}
                                className="rounded-full bg-card-border px-3 py-1 text-xs text-text-muted transition-colors motion-transition hover:bg-primary hover:text-white"
                            >
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                ) : null}

                <Link
                    href={`/posts/${id}`}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary"
                >
                    <span>阅读全文</span>
                    <FaArrowRight className="transition-transform motion-transition group-hover:translate-x-1" />
                </Link>
            </div>
        </article>
    );
};
