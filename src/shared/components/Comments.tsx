'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/shared/providers/ThemeProvider';

declare global {
    interface Window {
        remark_config?: Record<string, unknown>;
        REMARK42?: {
            createInstance?: (config: Record<string, unknown>) => void;
            destroy?: () => void;
        };
    }
}

const REMARK_SCRIPT_ID = 'remark42-embed-script';

function ensureRemarkScript(
    src: string,
    onReady: () => void,
    onError: () => void
) {
    const existing = document.getElementById(REMARK_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
        if (existing.dataset.loaded === 'true') {
            onReady();
            return;
        }
        const handleLoad = () => onReady();
        const handleError = () => onError();
        existing.addEventListener('load', handleLoad, { once: true });
        existing.addEventListener('error', handleError, { once: true });
        return;
    }

    const script = document.createElement('script');
    script.id = REMARK_SCRIPT_ID;
    script.src = src;
    script.defer = true;
    script.dataset.loaded = 'false';
    script.onload = () => {
        script.dataset.loaded = 'true';
        onReady();
    };
    script.onerror = () => {
        onError();
    };
    document.head.appendChild(script);
}

export default function Comments() {
    const [loadError, setLoadError] = useState(false);
    const pathname = usePathname();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const useProxy = process.env.NEXT_PUBLIC_REMARK42_USE_PROXY !== 'false';
        const directHost = (process.env.NEXT_PUBLIC_REMARK42_URL || 'http://localhost:8080').replace(/\/+$/, '');
        const host = useProxy
            ? `${window.location.origin}/remark42-proxy`
            : directHost;
        const siteId = process.env.NEXT_PUBLIC_REMARK42_SITE_ID || 'sakurairo';
        const container = containerRef.current;
        if (!container) return;

        let cancelled = false;

        window.remark_config = {
            host,
            site_id: siteId,
            components: ['embed'],
            theme: resolvedTheme,
            locale: 'zh',
            show_email_subscription: false,
        };

        // Third-party scripts may mutate this container. Reset it explicitly
        // to keep React ownership stable before each route-level initialization.
        container.innerHTML = '';

        const init = () => {
            if (cancelled) return;
            try {
                if (window.REMARK42?.createInstance) {
                    window.REMARK42.createInstance(window.remark_config || {});
                    setLoadError(false);
                    return;
                }
            } catch (error) {
                console.error('Remark42 init failed:', error);
            }
            setLoadError(true);
        };

        ensureRemarkScript(`${host}/web/embed.js`, init, () => {
            if (!cancelled) {
                setLoadError(true);
            }
        });

        return () => {
            cancelled = true;
            try {
                window.REMARK42?.destroy?.();
            } catch {
                // noop
            }
            container.innerHTML = '';
        };
    }, [pathname, resolvedTheme]);

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
            <div
                ref={containerRef}
                id="remark42"
                className="min-h-[200px]"
                data-path={pathname || '/'}
            />
        </div>
    );
}
