import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import { Sidebar } from "@/components/Sidebar";
import { articleApi, Article } from "@/shared/api/article";
import { stripMarkdown } from "@/shared/utils/stripMarkdown";

// 标记这个页面为动态渲染，避免构建时请求 API
export const dynamic = 'force-dynamic';

// Fetch data on server
async function getData(): Promise<Article[]> {
  try {
    const res = await articleApi.getList({ page: 1, pageSize: 10 });
    return res.rows || [];
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    // 在构建时或 API 不可用时返回空数组
    return [];
  }
}

export default async function Home() {
  const posts = await getData();

  return (
    <>
      <Hero />
      <div className="container mx-auto px-4 py-16 max-w-5xl space-y-12">
        <h2 className="text-center text-3xl font-bold font-serif mb-12 flex items-center justify-center gap-4">
          <span className="w-12 h-1 bg-primary/20 rounded-full"></span>
          <span>最新文章</span>
          <span className="w-12 h-1 bg-primary/20 rounded-full"></span>
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {posts.map((post, index) => (
              <ArticleCard
                key={post.id}
                id={post.id}
                title={post.title}
                summary={stripMarkdown(post.content).substring(0, 150) + "..."}
                cover={post.cover}
                createdAt={post.createdAt}
                category={post.category || { name: 'Uncategorized' }}
                tags={post.tags || []}
                index={index}
              />
            ))}
            <div className="text-center mt-12">
              <Link
                href="/posts"
                className="inline-block px-8 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 hover:border-primary rounded-full transition-all motion-transition shadow-sm"
              >
                查看全部文章
              </Link>
            </div>
          </div>

          {/* Sidebar - hidden on mobile */}
          <div className="hidden md:block">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}
