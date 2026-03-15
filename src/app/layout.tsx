import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/shared/providers/QueryProvider';
import { AppChrome } from '@/shared/components/AppChrome';
import { siteProfile } from '@/shared/constants/siteProfile';

export const metadata: Metadata = {
    title: `${siteProfile.siteName} | ${siteProfile.siteNameEn}`,
    description: siteProfile.metadataDescription,
    keywords: ['博客', '落樱轻声', 'Sakura Whispers', 'Java', 'Go', 'Electron', 'Next.js', '阅读', '生活', '随笔'],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN" className="dark" data-theme="dark">
            <body className="font-sans bg-background text-foreground transition-colors duration-300">
                <QueryProvider>
                    <AppChrome>{children}</AppChrome>
                </QueryProvider>
            </body>
        </html>
    );
}
