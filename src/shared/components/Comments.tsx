'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/shared/providers/ThemeProvider';

// Remark42 configuration type
declare global {
    interface Window {
        remark_config: any;
        REMARK42: any;
    }
}

export default function Comments() {
    const [mounted, setMounted] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const remarkUrl = process.env.NEXT_PUBLIC_REMARK42_URL || 'http://localhost:8080';
        const siteId = process.env.NEXT_PUBLIC_REMARK42_SITE_ID || 'sakurairo';

        // Configure Remark42
        window.remark_config = {
            host: remarkUrl,
            site_id: siteId,
            components: ['embed'],
            theme: theme === 'dark' ? 'dark' : 'light',
            locale: 'zh',
            show_email_subscription: false,
        };

        // Load script
        const script = document.createElement('script');
        script.src = `${remarkUrl}/web/embed.js`;
        script.defer = true;
        script.onerror = () => {
            setLoadError(true);
        };
        script.onload = () => {
            // Initialize if already loaded
            if (window.REMARK42) {
                window.REMARK42.createInstance(window.remark_config);
                setLoadError(false);
            } else {
                setLoadError(true);
            }
        };

        // If script already exists, just re-init
        const existingScript = document.querySelector(`script[src="${script.src}"]`);
        if (existingScript) {
            if (window.REMARK42) {
                window.REMARK42.changeTheme(window.remark_config.theme);
                setLoadError(false);
            } else {
                setLoadError(true);
            }
        } else {
            document.head.appendChild(script);
        }

        return () => {
            // Cleanup if needed
            if (existingScript) {
                // We typically don't remove the script to avoid reloading it constantly
            }
        };
    }, [mounted, theme]);

    if (!mounted) return null;

    return (
        <div className="w-full mt-10 animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 border-l-4 border-primary pl-3">
                💬 评论
            </h3>
            {loadError && (
                <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3 text-sm">
                    评论服务暂时不可用，请稍后重试。
                </div>
            )}
            <div id="remark42" className="min-h-[200px]"></div>
        </div>
    );
}
