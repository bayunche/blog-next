import Link from 'next/link';
import { Metadata } from 'next';
import { articleApi, ArchiveYear } from '@/shared/api/article';
import { getDisplayCategoryName } from '@/shared/utils/articleDisplay';
import { siteProfile } from '@/shared/constants/siteProfile';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: `归档 - ${siteProfile.siteName}`,
    description: '按时间整理写下来的技术、阅读、生活与日常记录。',
};

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

async function getArchivesData(): Promise<ArchiveYear[]> {
    try {
        return await articleApi.getArchives();
    } catch (error) {
        console.error('获取归档数据失败:', error);
        return [];
    }
}

function getYearSummary(year: ArchiveYear) {
    const categoryCounter = new Map<string, number>();

    for (const month of year.months) {
        for (const article of month.articles) {
            const categoryName = getDisplayCategoryName(article.category || null);
            categoryCounter.set(categoryName, (categoryCounter.get(categoryName) || 0) + 1);
        }
    }

    const topCategory = [...categoryCounter.entries()].sort((left, right) => right[1] - left[1])[0];

    if (!topCategory) {
        return '这一年留下的，是持续写作的痕迹。';
    }

    return `这一年主要围绕「${topCategory[0]}」写作，也慢慢留下了 ${year.count} 篇记录。`;
}

export default async function ArchivesPage() {
    const archives = await getArchivesData();
    const sortedArchives = [...archives].sort((left, right) => right.year - left.year);
    const totalCount = sortedArchives.reduce((acc, year) => acc + year.count, 0);
    const yearsCount = sortedArchives.length;

    return (
        <div className="min-h-screen pt-20">
            <div className="bg-gradient-to-br from-primary/10 via-pink-100/20 to-purple-100/10 py-16 dark:from-primary/5 dark:via-purple-900/10 dark:to-transparent">
                <div className="mx-auto max-w-6xl space-y-6 px-4">
                    <div className="space-y-3 text-center">
                        <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/80">
                            Writing Timeline
                        </p>
                        <h1 className="text-3xl font-bold font-serif sm:text-4xl">归档</h1>
                        <p className="mx-auto max-w-3xl text-sm leading-7 text-text-muted">
                            这里不只是时间线，也是我把技术、阅读、生活和阶段心绪一点点留下来的地方。
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div className="rounded-3xl border border-card-border bg-card-bg/80 p-6 text-center shadow-sm backdrop-blur-sm">
                            <div className="text-3xl font-bold text-primary">{totalCount}</div>
                            <div className="mt-2 text-sm text-text-muted">累计文章</div>
                        </div>
                        <div className="rounded-3xl border border-card-border bg-card-bg/80 p-6 text-center shadow-sm backdrop-blur-sm">
                            <div className="text-3xl font-bold text-primary">{yearsCount}</div>
                            <div className="mt-2 text-sm text-text-muted">写作年份</div>
                        </div>
                        <div className="rounded-3xl border border-card-border bg-card-bg/80 p-6 text-center shadow-sm backdrop-blur-sm">
                            <div className="text-3xl font-bold text-primary">{sortedArchives[0]?.year || '--'}</div>
                            <div className="mt-2 text-sm text-text-muted">最近更新年份</div>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {sortedArchives.map((year) => (
                            <a
                                key={year.year}
                                href={`#year-${year.year}`}
                                className="rounded-full border border-card-border px-4 py-2 text-sm text-text-muted transition-colors hover:border-primary/30 hover:text-primary"
                            >
                                {year.year}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-12">
                {sortedArchives.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-card-border bg-card-bg/70 py-20 text-center text-text-muted">
                        <p className="mb-4 text-xl">📭 暂无文章</p>
                        <p>等技术笔记、读书心得和日常片段慢慢积累起来，这里会变成一条更长也更像生活的时间线。</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                        {sortedArchives.map((yearData) => (
                            <section key={yearData.year} id={`year-${yearData.year}`} className="mb-12 scroll-mt-24">
                                <div className="relative mb-6 flex items-center gap-4">
                                    <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                                        {yearData.count}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold font-serif">{yearData.year}</h2>
                                        <p className="mt-2 text-sm text-text-muted">
                                            {getYearSummary(yearData)}
                                        </p>
                                    </div>
                                </div>

                                {yearData.months.map((monthData) => (
                                    <div key={`${yearData.year}-${monthData.month}`} className="mb-8 ml-8 sm:ml-16">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="h-3 w-3 rounded-full bg-primary/60" />
                                            <h3 className="text-xl font-medium text-text-muted">
                                                {monthNames[monthData.month - 1]}
                                                <span className="ml-2 text-sm text-text-subtle">({monthData.count}篇)</span>
                                            </h3>
                                        </div>

                                        <ul className="ml-0 space-y-3 sm:ml-6">
                                            {monthData.articles.map((article) => {
                                                const date = new Date(article.createdAt);
                                                const day = date.getDate();

                                                return (
                                                    <li key={article.id} className="group">
                                                        <Link
                                                            href={`/posts/${article.id}`}
                                                            className="-ml-3 flex flex-wrap items-center gap-3 rounded-xl p-3 transition-all hover:bg-card-bg/50 sm:flex-nowrap sm:gap-4"
                                                        >
                                                            <span className="w-8 shrink-0 text-center text-sm text-text-subtle">
                                                                {day}日
                                                            </span>
                                                            <span className="flex-1 line-clamp-1 text-lg transition-colors group-hover:text-primary">
                                                                {article.title}
                                                            </span>
                                                            {article.category ? (
                                                                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                                                                    {getDisplayCategoryName(article.category)}
                                                                </span>
                                                            ) : null}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
