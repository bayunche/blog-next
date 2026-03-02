import type { Metadata } from "next";
import { Inter, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/shared/providers/QueryProvider";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { AppChrome } from "@/shared/components/AppChrome";

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
  title: "落樱轻声 | Sakura Whispers",
  description: "记录生活的美好瞬间，分享技术与思考",
  keywords: ["博客", "落樱轻声", "Sakura Whispers", "Sakurairo", "React", "Next.js"],
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
            <AppChrome>{children}</AppChrome>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
