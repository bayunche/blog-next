'use client';

import { useCallback, useEffect, useEffectEvent, useState, useSyncExternalStore } from 'react';
import { FaList, FaTimes } from 'react-icons/fa';
import { clsx } from 'clsx';
import { createHeadingIdResolver } from '@/shared/utils/headingId';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content?: string; // Markdown 内容
    contentSelector?: string; // 文章内容区域选择器
}

// 从 Markdown 内容中提取标题
const extractHeadingsFromMarkdown = (content: string): TocItem[] => {
    const headingRegex = /^(#{1,4})\s+(.+)$/gm;
    const items: TocItem[] = [];
    const resolveHeadingId = createHeadingIdResolver();
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2].replace(/\s+#+\s*$/, '').trim();
        const id = resolveHeadingId(text);
        items.push({ id, text, level });
    }

    return items;
};

export const TableOfContents = ({ content, contentSelector = '#article-content' }: TableOfContentsProps) => {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const syncHeadings = useEffectEvent((items: TocItem[]) => {
        setHeadings(items);
    });
    const isMobile = useSyncExternalStore(
        (onStoreChange) => {
            if (typeof window === 'undefined') {
                return () => undefined;
            }

            const mediaQuery = window.matchMedia('(max-width: 1023px)');
            const handleChange = () => onStoreChange();

            mediaQuery.addEventListener('change', handleChange);
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        },
        () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches,
        () => false
    );

    // 提取标题
    useEffect(() => {
        // 如果提供了 content，从 Markdown 提取标题
        if (content) {
            const items = extractHeadingsFromMarkdown(content);
            syncHeadings(items);
        } else {
            // 否则从 DOM 提取
            const contentElement = document.querySelector(contentSelector);
            if (!contentElement) {
                syncHeadings([]);
                return;
            }

            const headingElements = contentElement.querySelectorAll('h1, h2, h3, h4');
            const items: TocItem[] = [];

            headingElements.forEach((heading, index) => {
                const id = heading.id || `heading-${index}`;
                if (!heading.id) {
                    heading.id = id;
                }

                items.push({
                    id,
                    text: heading.textContent || '',
                    level: parseInt(heading.tagName[1]),
                });
            });

            syncHeadings(items);
        }
    }, [content, contentSelector]);

    // 滚动监听，高亮当前标题
    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: '-80px 0px -80% 0px',
                threshold: 0,
            }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    // 点击跳转
    const scrollToHeading = useCallback((id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // 顶部偏移
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
            setActiveId(id);
            if (isMobile) setIsOpen(false);
        }
    }, [isMobile]);

    if (headings.length === 0) return null;

    // 移动端浮动按钮
    if (isMobile) {
        return (
            <>
                {/* 浮动按钮 */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed left-4 bottom-[calc(env(safe-area-inset-bottom)+5rem)] z-40 rounded-full bg-primary p-3 text-white shadow-lg transition-transform motion-transition hover:scale-110"
                    title="文章目录"
                >
                    {isOpen ? <FaTimes size={18} /> : <FaList size={18} />}
                </button>

                {/* 目录面板 */}
                <div
                    className={clsx(
                        'fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+9rem)] z-40 max-h-[min(24rem,55vh)] overflow-hidden rounded-2xl border border-card-border bg-card-bg/95 backdrop-blur-xl shadow-2xl transition-all motion-transition',
                        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    )}
                >
                    <div className="p-3 border-b border-card-border">
                        <h4 className="text-sm font-bold flex items-center gap-2">
                            <FaList className="text-primary" />
                            文章目录
                        </h4>
                    </div>
                    <nav className="max-h-[min(20rem,45vh)] overflow-y-auto p-2">
                        {headings.map((heading) => (
                            <button
                                key={heading.id}
                                onClick={() => scrollToHeading(heading.id)}
                                className={clsx(
                                    'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors motion-transition',
                                    activeId === heading.id
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-text-muted hover:bg-card-border/50 hover:text-foreground'
                                )}
                                style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
                            >
                                {heading.text}
                            </button>
                        ))}
                    </nav>
                </div>
            </>
        );
    }

    // 桌面端侧边栏
    return (
        <aside className="hidden lg:block fixed right-8 top-1/2 -translate-y-1/2 w-56 max-h-[60vh] z-30">
            <div className="bg-card-bg/80 backdrop-blur-xl rounded-2xl shadow-lg border border-card-border p-4">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-text-muted">
                    <FaList className="text-primary" />
                    文章目录
                </h4>
                <nav className="space-y-1 max-h-[50vh] overflow-y-auto">
                    {headings.map((heading) => (
                        <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={clsx(
                                'block w-full text-left text-sm py-1.5 transition-all motion-transition truncate border-l-2',
                                activeId === heading.id
                                    ? 'border-primary text-primary font-medium pl-3'
                                    : 'border-transparent text-text-muted hover:text-foreground hover:border-primary/50 pl-3'
                            )}
                            style={{ paddingLeft: `${(heading.level - 1) * 8 + 12}px` }}
                        >
                            {heading.text}
                        </button>
                    ))}
                </nav>
            </div>
        </aside>
    );
};
