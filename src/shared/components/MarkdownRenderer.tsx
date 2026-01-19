'use client';

import React_Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MarkdownCodeBlock } from '@/components/CodeBlock';

interface MarkdownRendererProps {
    content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    return (
        <article className="prose prose-lg md:prose-xl max-w-none dark:prose-invert font-serif prose-headings:font-sans prose-a:text-primary hover:prose-a:text-primary/80">
            <React_Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Mac 风格代码块
                    code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !className;

                        // 内联代码
                        if (isInline) {
                            return (
                                <code
                                    className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-primary text-sm font-mono"
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        }

                        // 代码块 - 使用 Mac 风格组件
                        return (
                            <MarkdownCodeBlock className={className}>
                                {String(children).replace(/\n$/, '')}
                            </MarkdownCodeBlock>
                        );
                    },
                    // 图片优化
                    img: ({ node, ...props }) => (
                        <span className="block my-8 text-center">
                            <img {...props} className="rounded-lg shadow-lg max-h-[500px] mx-auto transition-transform hover:scale-[1.02]" />
                        </span>
                    ),
                    // 引用块样式
                    blockquote: ({ node, ...props }) => (
                        <blockquote {...props} className="border-l-4 border-primary bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-r-lg italic" />
                    ),
                    // 标题添加锚点
                    h1: ({ node, children, ...props }) => (
                        <h1 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-24" {...props}>
                            {children}
                        </h1>
                    ),
                    h2: ({ node, children, ...props }) => (
                        <h2 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-24" {...props}>
                            {children}
                        </h2>
                    ),
                    h3: ({ node, children, ...props }) => (
                        <h3 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-24" {...props}>
                            {children}
                        </h3>
                    ),
                    h4: ({ node, children, ...props }) => (
                        <h4 id={String(children).toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-24" {...props}>
                            {children}
                        </h4>
                    ),
                    // 链接新窗口打开外部链接
                    a: ({ node, href, children, ...props }) => {
                        const isExternal = href?.startsWith('http');
                        return (
                            <a
                                href={href}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="text-primary hover:text-primary/80 transition-colors"
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },
                    // 表格样式
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6">
                            <table className="min-w-full border-collapse" {...props} />
                        </div>
                    ),
                    th: ({ node, ...props }) => (
                        <th className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-left font-semibold" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                        <td className="border border-gray-200 dark:border-gray-700 px-4 py-2" {...props} />
                    ),
                }}
            >
                {content}
            </React_Markdown>
        </article>
    );
};
