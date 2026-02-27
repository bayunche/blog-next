'use client';

import { useState, useCallback } from 'react';
import { FaCopy, FaCheck, FaExpand, FaCompress } from 'react-icons/fa';
import { clsx } from 'clsx';

interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
}

export const CodeBlock = ({
    code,
    language = 'plaintext',
    filename,
    showLineNumbers = true
}: CodeBlockProps) => {
    const [copied, setCopied] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    // 复制代码
    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [code]);

    // 切换全屏
    const toggleFullscreen = () => {
        setFullscreen(!fullscreen);
    };

    // 处理代码行
    const lines = code.split('\n');

    // 语言显示名称映射
    const languageNames: Record<string, string> = {
        javascript: 'JavaScript',
        typescript: 'TypeScript',
        python: 'Python',
        java: 'Java',
        cpp: 'C++',
        c: 'C',
        go: 'Go',
        rust: 'Rust',
        html: 'HTML',
        css: 'CSS',
        scss: 'SCSS',
        json: 'JSON',
        yaml: 'YAML',
        sql: 'SQL',
        bash: 'Bash',
        shell: 'Shell',
        markdown: 'Markdown',
        plaintext: 'Plain Text',
    };

    return (
        <div
            className={clsx(
                'group relative rounded-xl overflow-hidden my-6 shadow-lg',
                fullscreen && 'fixed inset-4 z-50 my-0'
            )}
        >
            {/* Mac 风格标题栏 */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 dark:bg-gray-900">
                {/* 三个小圆点 */}
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <button
                            onClick={toggleFullscreen}
                            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                            title="关闭全屏"
                        />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <button
                            onClick={toggleFullscreen}
                            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                            title="全屏"
                        />
                    </div>
                    {/* 文件名 */}
                    {filename && (
                        <span className="ml-4 text-xs text-gray-400 font-mono">
                            {filename}
                        </span>
                    )}
                </div>

                {/* 右侧工具栏 */}
                <div className="flex items-center gap-2">
                    {/* 语言标签 */}
                    <span className="text-xs text-gray-500 font-mono">
                        {languageNames[language] || language}
                    </span>
                    {/* 全屏按钮 */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-1.5 text-gray-500 hover:text-white transition-colors"
                        title={fullscreen ? '退出全屏' : '全屏'}
                    >
                        {fullscreen ? <FaCompress size={12} /> : <FaExpand size={12} />}
                    </button>
                    {/* 复制按钮 */}
                    <button
                        onClick={copyToClipboard}
                        className={clsx(
                            'p-1.5 transition-colors',
                            copied ? 'text-green-400' : 'text-gray-500 hover:text-white'
                        )}
                        title={copied ? '已复制' : '复制代码'}
                    >
                        {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                    </button>
                </div>
            </div>

            {/* 代码区域 */}
            <div className={clsx(
                'overflow-auto bg-gray-900 dark:bg-gray-950',
                fullscreen ? 'h-[calc(100%-40px)]' : 'max-h-[500px]'
            )}>
                <pre className="p-4 text-sm font-mono leading-relaxed">
                    <code className={`language-${language}`}>
                        {lines.map((line, index) => (
                            <div
                                key={index}
                                className="flex hover:bg-white/5 -mx-4 px-4"
                            >
                                {showLineNumbers && (
                                    <span className="select-none text-gray-600 w-8 text-right mr-4 flex-shrink-0">
                                        {index + 1}
                                    </span>
                                )}
                                <span className="text-gray-300 whitespace-pre">
                                    {line || ' '}
                                </span>
                            </div>
                        ))}
                    </code>
                </pre>
            </div>

            {/* 全屏时的背景遮罩 */}
            {fullscreen && (
                <div
                    className="fixed inset-0 bg-black/80 -z-10"
                    onClick={toggleFullscreen}
                />
            )}
        </div>
    );
};

// 简化的 Markdown 代码块包装器
export const MarkdownCodeBlock = ({
    children,
    className
}: {
    children: string;
    className?: string;
}) => {
    // 从 className 中提取语言
    const language = className?.replace('language-', '') || 'plaintext';

    return (
        <CodeBlock
            code={children.trim()}
            language={language}
        />
    );
};
