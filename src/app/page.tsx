import { Hero } from "@/components/Hero";
import { ArticleCard } from "@/features/article/components/ArticleCard";
import { Sidebar } from "@/components/Sidebar";
import { articleApi, Article } from "@/shared/api/article";

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
          <span>Latest Posts</span>
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
                summary={post.content.substring(0, 150) + "..."} // Simple summary from content
                cover={post.cover}
                createdAt={post.createdAt}
                category={post.category || { name: 'Uncategorized' }}
                tags={post.tags || []}
                index={index}
              />
            ))}
            <div className="text-center mt-12">
              <button className="px-8 py-3 bg-white border border-gray-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                View All Posts
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </>
  );
}
