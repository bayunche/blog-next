import type { Metadata } from "next";
import { Inter, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/shared/components/Navbar";
import { Background } from "@/shared/components/Background";
import { Footer } from "@/shared/components/Footer";
import QueryProvider from "@/shared/providers/QueryProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { SakuraParticles } from "@/components/SakuraParticles";
import { FloatingToolbar } from "@/components/FloatingToolbar";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Live2DWidget } from "@/components/Live2DWidget";
import { MusicPlayer } from "@/components/MusicPlayer";

// 正文字体 - Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// 标题字体 - 思源宋体
const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "樱落繁星 | Sakura Stars",
  description: "记录生活的美好瞬间，分享技术与思考",
  keywords: ["博客", "樱落繁星", "Sakurairo", "React", "Next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSerifSC.variable} font-sans bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider>
          <QueryProvider>
            {/* 页面加载动画 */}
            <LoadingScreen />

            {/* 背景层 */}
            <Background />
            <SakuraParticles count={25} />

            {/* 主内容区 */}
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />

            {/* 悬浮组件 */}
            <FloatingToolbar />
            <Live2DWidget />
            <MusicPlayer />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
