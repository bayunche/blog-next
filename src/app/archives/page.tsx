import { articleApi, ArchiveYear } from '@/shared/api/article';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: '归档 - Sakurairo Blog',
    description: '按时间归档的所有文章',
};

// 月份名称
const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

async function getArchivesData(): Promise<ArchiveYear[]> {
    try {
        const data = await articleApi.getArchives();
        return data;
    } catch (error) {
        console.error('获取归档数据失败:', error);
        return [];
    }
}

export default async function ArchivesPage() {
    const archives = await getArchivesData();

    // 计算总文章数
    const totalCount = archives.reduce((acc, year) => acc + year.count, 0);

    return (
        <div className="min-h-screen">
            {/* 页面头部 */}
            <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent" />
                <div className="relative z-10 text-center">
                    <h1 className="text-5xl font-bold font-serif mb-4">归档</h1>
                    <p className="text-lg text-text-muted">
                        共计 <span className="text-primary font-bold">{totalCount}</span> 篇文章
                    </p>
                </div>
            </div>

            {/* 归档内容 */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {archives.length === 0 ? (
                    <div className="text-center text-text-muted py-20">
                        <p className="text-xl mb-4">📭 暂无文章</p>
                        <p>快去写点什么吧~</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* 时间线 */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                        {archives.map((yearData) => (
                            <div key={yearData.year} className="mb-12">
                                {/* 年份标题 */}
                                <div className="relative flex items-center gap-4 mb-8">
                                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold z-10">
                                        {yearData.count}
                                    </div>
                                    <h2 className="text-3xl font-bold font-serif">{yearData.year}</h2>
                                </div>

                                {/* 月份列表 */}
                                {yearData.months.map((monthData) => (
                                    <div key={`${yearData.year}-${monthData.month}`} className="ml-16 mb-8">
                                        {/* 月份标题 */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-3 h-3 rounded-full bg-primary/60" />
                                            <h3 className="text-xl font-medium text-text-muted">
                                                {monthNames[monthData.month - 1]}
                                                <span className="text-sm ml-2 text-text-subtle">({monthData.count}篇)</span>
                                            </h3>
                                        </div>

                                        {/* 文章列表 */}
                                        <ul className="space-y-3 ml-6">
                                            {monthData.articles.map((article) => {
                                                const date = new Date(article.createdAt);
                                                const day = date.getDate();

                                                return (
                                                    <li key={article.id} className="group">
                                                        <Link
                                                            href={`/posts/${article.id}`}
                                                            className="flex items-center gap-4 p-3 -ml-3 rounded-xl hover:bg-card-bg/50 transition-all"
                                                        >
                                                            {/* 日期 */}
                                                            <span className="text-sm text-text-subtle w-8 text-center shrink-0">
                                                                {day}日
                                                            </span>

                                                            {/* 标题 */}
                                                            <span className="text-lg group-hover:text-primary transition-colors line-clamp-1 flex-1">
                                                                {article.title}
                                                            </span>

                                                            {/* 分类标签 */}
                                                            {article.category && (
                                                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full shrink-0">
                                                                    {article.category.name}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
