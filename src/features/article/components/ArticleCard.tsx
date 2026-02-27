import Link from 'next/link';
import Image from 'next/image';
import { FaCalendar, FaFolder, FaFire, FaComment, FaArrowRight } from 'react-icons/fa';
import dayjs from 'dayjs';

interface ArticleCardProps {
    id: number;
    title: string;
    summary: string;
    cover?: string;
    createdAt: string;
    category?: { name: string } | null;
    tags?: { name: string }[];
    index: number;
    viewCount?: number;
    commentCount?: number;
}

export const ArticleCard = ({
    id,
    title,
    summary,
    cover,
    createdAt,
    category,
    tags = [],
    index,
    viewCount = 0,
    commentCount = 0
}: ArticleCardProps) => {
    const isReversed = index % 2 === 1;

    return (
        <article
            className={`
                group relative flex flex-col overflow-hidden
                bg-card-bg/80 backdrop-blur-sm rounded-2xl shadow-md
                hover:shadow-2xl transition-all motion-transition-slow
                hover:-translate-y-2 animate-fade-in-up
                border border-card-border/50
                ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'}
            `}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Thumbnail with overlay */}
            <div className="relative w-full md:w-1/2 h-56 md:h-[320px] overflow-hidden">
                <Link href={`/posts/${id}`} className="block w-full h-full">
                    <Image
                        src={cover || '/images/background.jpg'}
                        alt={title}
                        fill
                        className="object-cover transition-transform motion-transition-slow group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity motion-transition" />
                </Link>

                {/* Category badge */}
                {category && (
                    <Link
                        href={`/categories/${encodeURIComponent(category.name)}`}
                        className="absolute top-4 left-4 bg-primary/90 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm hover:bg-primary transition-colors motion-transition"
                    >
                        {category.name}
                    </Link>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">
                {/* Decorative line */}
                <div className={`absolute top-0 ${isReversed ? 'right-0' : 'left-0'} w-1 h-full bg-gradient-to-b from-primary via-pink-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity motion-transition`} />

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted mb-4">
                    <span className="flex items-center gap-1.5">
                        <FaCalendar className="text-primary" />
                        {dayjs(createdAt).format('YYYY年M月D日')}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FaFire className="text-orange-500" />
                        {viewCount} 热度
                    </span>
                    <span className="flex items-center gap-1.5">
                        <FaComment className="text-blue-500" />
                        {commentCount} 评论
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors motion-transition">
                    <Link href={`/posts/${id}`}>
                        {title}
                    </Link>
                </h2>

                {/* Summary */}
                <p className="text-text-muted text-sm leading-relaxed line-clamp-3 mb-6">
                    {summary}
                </p>

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.slice(0, 3).map(tag => (
                            <Link
                                key={tag.name}
                                href={`/tags/${encodeURIComponent(tag.name)}`}
                                className="text-xs bg-card-border hover:bg-primary hover:text-white px-3 py-1 rounded-full transition-colors motion-transition"
                            >
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Read more button */}
                <Link
                    href={`/posts/${id}`}
                    className="inline-flex items-center gap-2 text-sm text-primary font-medium group/btn mt-auto"
                >
                    <span>阅读全文</span>
                    <FaArrowRight className="transition-transform motion-transition group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </article>
    );
};
