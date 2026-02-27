'use client';

import { clsx } from 'clsx';

interface SkeletonProps {
    className?: string;
    animate?: boolean;
}

/**
 * 基础骨架屏组件
 */
export const Skeleton = ({ className = '', animate = true }: SkeletonProps) => (
    <div
        className={clsx(
            'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded',
            animate && 'animate-pulse bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]',
            className
        )}
    />
);

/**
 * 文章卡片骨架屏
 */
export const ArticleCardSkeleton = ({ index = 0 }: { index?: number }) => {
    const isReversed = index % 2 === 1;

    return (
        <article
            className={clsx(
                'group relative flex flex-col overflow-hidden',
                'bg-card-bg/80 backdrop-blur-sm rounded-2xl shadow-md',
                'border border-card-border/50',
                isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
            )}
        >
            {/* 封面骨架 */}
            <div className="relative w-full md:w-1/2 h-56 md:h-[320px] overflow-hidden">
                <Skeleton className="w-full h-full rounded-none" />
                {/* 分类标签骨架 */}
                <div className="absolute top-4 left-4">
                    <Skeleton className="w-20 h-6 rounded-full" />
                </div>
            </div>

            {/* 内容骨架 */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center space-y-4">
                {/* Meta 信息 */}
                <div className="flex gap-4">
                    <Skeleton className="w-24 h-4 rounded" />
                    <Skeleton className="w-16 h-4 rounded" />
                    <Skeleton className="w-16 h-4 rounded" />
                </div>

                {/* 标题 */}
                <Skeleton className="w-3/4 h-7 rounded" />

                {/* 摘要 */}
                <div className="space-y-2">
                    <Skeleton className="w-full h-4 rounded" />
                    <Skeleton className="w-5/6 h-4 rounded" />
                    <Skeleton className="w-2/3 h-4 rounded" />
                </div>

                {/* 标签 */}
                <div className="flex gap-2">
                    <Skeleton className="w-16 h-6 rounded-full" />
                    <Skeleton className="w-20 h-6 rounded-full" />
                    <Skeleton className="w-14 h-6 rounded-full" />
                </div>

                {/* 阅读更多 */}
                <Skeleton className="w-24 h-5 rounded mt-auto" />
            </div>
        </article>
    );
};

/**
 * 侧边栏骨架屏
 */
export const SidebarSkeleton = () => (
    <aside className="hidden md:block w-80 space-y-6">
        {/* 站长信息卡片 */}
        <div className="bg-card-bg rounded-2xl shadow-md border border-card-border p-6">
            <div className="flex flex-col items-center">
                <Skeleton className="w-20 h-20 rounded-full mb-4" />
                <Skeleton className="w-24 h-6 rounded mb-2" />
                <Skeleton className="w-32 h-4 rounded" />
            </div>
            <div className="flex justify-center gap-3 mt-4">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full" />
            </div>
        </div>

        {/* 分类列表 */}
        <div className="bg-card-bg rounded-2xl shadow-md border border-card-border p-6">
            <Skeleton className="w-20 h-6 rounded mb-4" />
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                        <Skeleton className="w-24 h-4 rounded" />
                        <Skeleton className="w-8 h-4 rounded" />
                    </div>
                ))}
            </div>
        </div>

        {/* 标签云 */}
        <div className="bg-card-bg rounded-2xl shadow-md border border-card-border p-6">
            <Skeleton className="w-16 h-6 rounded mb-4" />
            <div className="flex flex-wrap gap-2">
                {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className={`h-6 rounded-full ${i % 3 === 0 ? 'w-16' : i % 3 === 1 ? 'w-20' : 'w-12'}`} />
                ))}
            </div>
        </div>
    </aside>
);

/**
 * 文章内容骨架屏
 */
export const ContentSkeleton = () => (
    <div className="bg-card-bg rounded-2xl shadow-md border border-card-border p-8 space-y-6">
        {/* 标题 */}
        <Skeleton className="w-3/4 h-10 rounded" />

        {/* Meta 信息 */}
        <div className="flex gap-4">
            <Skeleton className="w-24 h-5 rounded" />
            <Skeleton className="w-20 h-5 rounded" />
            <Skeleton className="w-16 h-5 rounded" />
        </div>

        {/* 封面图 */}
        <Skeleton className="w-full h-64 rounded-xl" />

        {/* 内容段落 */}
        <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="w-full h-4 rounded" />
                    <Skeleton className="w-5/6 h-4 rounded" />
                    <Skeleton className="w-4/5 h-4 rounded" />
                    {i % 2 === 0 && <Skeleton className="w-3/4 h-4 rounded" />}
                </div>
            ))}
        </div>
    </div>
);

/**
 * 文章列表骨架屏
 */
export const ArticleListSkeleton = ({ count = 5 }: { count?: number }) => (
    <div className="space-y-8">
        {[...Array(count)].map((_, i) => (
            <ArticleCardSkeleton key={i} index={i} />
        ))}
    </div>
);

/**
 * Hero 区域骨架屏
 */
export const HeroSkeleton = () => (
    <div className="relative h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
        <div className="space-y-6">
            <Skeleton className="w-32 h-32 rounded-full mx-auto" />
            <Skeleton className="w-48 h-10 rounded mx-auto" />
            <Skeleton className="w-64 h-16 rounded-xl mx-auto" />
        </div>
    </div>
);

export default Skeleton;
