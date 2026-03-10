'use client';

import { useState, useCallback, useMemo } from 'react';
import { FaCopy, FaCheck, FaExpand, FaCompress, FaAlignLeft } from 'react-icons/fa';
import { clsx } from 'clsx';
import hljs from 'highlight.js';

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
    const [wrapLines, setWrapLines] = useState(false);

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

    // 切换自动换行
    const toggleWrap = () => {
        setWrapLines(!wrapLines);
    };

    const normalizedLanguage = useMemo(
        () => (language || 'plaintext').toLowerCase().replace(/^language-/, '').trim(),
        [language]
    );

    const escapeHtml = (value: string) =>
        value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    const { highlightedCode, detectedLanguage } = useMemo(() => {
        const normalizedCode = code.replace(/\r\n/g, '\n');
        try {
            if (
                normalizedLanguage &&
                normalizedLanguage !== 'plaintext' &&
                hljs.getLanguage(normalizedLanguage)
            ) {
                return {
                    highlightedCode: hljs.highlight(normalizedCode, {
                        language: normalizedLanguage,
                        ignoreIllegals: true,
                    }).value,
                    detectedLanguage: normalizedLanguage,
                };
            }
            const autoResult = hljs.highlightAuto(normalizedCode);
            return {
                highlightedCode: autoResult.value,
                detectedLanguage: autoResult.language || 'plaintext',
            };
        } catch {
            return {
                highlightedCode: escapeHtml(normalizedCode),
                detectedLanguage: normalizedLanguage || 'plaintext',
            };
        }
    }, [code, normalizedLanguage]);

    // 处理代码行
    const lines = useMemo(() => highlightedCode.split('\n'), [highlightedCode]);
    const displayLanguage = normalizedLanguage === 'plaintext' ? detectedLanguage : normalizedLanguage;

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
        sh: 'Shell',
        tsx: 'TSX',
        jsx: 'JSX',
        csharp: 'C#',
        php: 'PHP',
        markdown: 'Markdown',
        plaintext: 'Plain Text',
    };

    return (
        <div
            className={clsx(
                'code-block group relative rounded-2xl overflow-hidden my-6 border border-slate-700/70 shadow-xl bg-[#0d1117]',
                fullscreen && 'fixed inset-4 z-[80] my-0'
            )}
        >
            {/* Mac 风格标题栏 */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 bg-[#111827] border-b border-slate-700/70">
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
                        <span className="ml-4 text-xs text-slate-300/90 font-mono truncate max-w-[36vw]">
                            {filename}
                        </span>
                    )}
                </div>

                {/* 右侧工具栏 */}
                <div className="flex items-center gap-2">
                    {/* 语言标签 */}
                    <span className="text-[11px] px-2 py-0.5 rounded-md border border-slate-600/70 text-slate-300 font-mono uppercase tracking-wide">
                        {languageNames[displayLanguage] || displayLanguage}
                    </span>
                    {/* 自动换行 */}
                    <button
                        onClick={toggleWrap}
                        className={clsx(
                            'p-1.5 transition-colors',
                            wrapLines ? 'text-primary' : 'text-slate-400 hover:text-white'
                        )}
                        title={wrapLines ? '关闭自动换行' : '开启自动换行'}
                    >
                        <FaAlignLeft size={12} />
                    </button>
                    {/* 全屏按钮 */}
                    <button
                        onClick={toggleFullscreen}
                        className="p-1.5 text-slate-400 hover:text-white transition-colors"
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
                'overflow-auto bg-[#0d1117]',
                fullscreen ? 'h-[calc(100%-44px)]' : 'max-h-[560px]'
            )}>
                <pre
                    className={clsx(
                        'm-0 py-4 text-[13px] font-mono leading-6',
                        wrapLines ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'
                    )}
                >
                    <code className={`hljs language-${displayLanguage} bg-transparent`}>
                        {lines.map((line, index) => (
                            <span
                                key={index}
                                className="grid grid-cols-[auto_minmax(0,1fr)] hover:bg-white/5 transition-colors"
                            >
                                {showLineNumbers && (
                                    <span className="select-none text-slate-500 min-w-[3.5rem] px-3 text-right border-r border-slate-800/80">
                                        {index + 1}
                                    </span>
                                )}
                                <span
                                    className={clsx(
                                        'px-4',
                                        wrapLines ? 'break-words' : 'overflow-visible'
                                    )}
                                    dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
                                />
                            </span>
                        ))}
                    </code>
                </pre>
            </div>

            {/* 顶部/底部渐变，增强层次 */}
            <div className="pointer-events-none absolute inset-x-0 top-[44px] h-6 bg-gradient-to-b from-[#0d1117] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0d1117] to-transparent" />

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
    const languageMatch = /language-([\w#+-]+)/.exec(className || '');
    const language = languageMatch?.[1] || 'plaintext';

    return (
        <CodeBlock
            code={children.replace(/\n$/, '')}
            language={language}
        />
    );
};
