/**
 * Markdown 渲染器组件
 * 使用 react-markdown 渲染 Markdown 内容，支持代码高亮
 */

import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github-dark.css' // 代码高亮主题

/**
 * Markdown 渲染器 Props
 */
export interface MarkdownRendererProps {
  /** Markdown 内容 */
  content: string
  /** 自定义 className */
  className?: string
}

/**
 * Markdown 渲染器组件
 *
 * @example
 * ```tsx
 * <MarkdownRenderer content={article.content} />
 * ```
 */
export function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  // 在客户端渲染后添加代码块复制按钮
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('pre code')
    codeBlocks.forEach((block) => {
      const pre = block.parentElement
      if (!pre) return

      // 避免重复添加
      if (pre.querySelector('.copy-button')) return

      // 创建复制按钮
      const button = document.createElement('button')
      button.className = 'copy-button'
      button.textContent = '复制'
      button.onclick = async () => {
        const code = block.textContent || ''
        try {
          await navigator.clipboard.writeText(code)
          button.textContent = '已复制!'
          setTimeout(() => {
            button.textContent = '复制'
          }, 2000)
        } catch (err) {
          console.error('复制失败:', err)
        }
      }

      pre.style.position = 'relative'
      pre.appendChild(button)
    })
  }, [content])

  return (
    <div className={`markdown-renderer ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // 支持 GitHub Flavored Markdown
        rehypePlugins={[rehypeRaw, rehypeHighlight]} // 支持原始 HTML 和代码高亮
        components={{
          // 自定义链接在新窗口打开
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          // 自定义图片样式
          img: ({ node, ...props }) => (
            <img
              {...props}
              style={{ maxWidth: '100%', height: 'auto' }}
              loading="lazy"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      {/* 自定义样式 */}
      <style>{`
        .markdown-renderer {
          line-height: 1.8;
          color: var(--text-primary);
        }

        .markdown-renderer h1,
        .markdown-renderer h2,
        .markdown-renderer h3,
        .markdown-renderer h4,
        .markdown-renderer h5,
        .markdown-renderer h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.4;
          color: var(--text-primary);
        }

        .markdown-renderer h1 {
          font-size: 2em;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 0.3em;
        }

        .markdown-renderer h2 {
          font-size: 1.5em;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.3em;
        }

        .markdown-renderer h3 {
          font-size: 1.25em;
        }

        .markdown-renderer p {
          margin-bottom: 1em;
        }

        .markdown-renderer code {
          background-color: var(--bg-secondary);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-size: 0.9em;
          font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }

        .markdown-renderer pre {
          background-color: #0d1117;
          border-radius: 8px;
          padding: 1em;
          overflow-x: auto;
          margin: 1em 0;
        }

        .markdown-renderer pre code {
          background-color: transparent;
          padding: 0;
          font-size: 0.875em;
          color: #c9d1d9;
        }

        .markdown-renderer .copy-button {
          position: absolute;
          top: 0.5em;
          right: 0.5em;
          padding: 0.25em 0.75em;
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          color: #c9d1d9;
          cursor: pointer;
          font-size: 0.75em;
          transition: all 0.2s;
        }

        .markdown-renderer .copy-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .markdown-renderer blockquote {
          border-left: 4px solid var(--primary-color);
          padding-left: 1em;
          margin: 1em 0;
          color: var(--text-secondary);
        }

        .markdown-renderer ul,
        .markdown-renderer ol {
          margin: 1em 0;
          padding-left: 2em;
        }

        .markdown-renderer li {
          margin: 0.5em 0;
        }

        .markdown-renderer table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }

        .markdown-renderer table th,
        .markdown-renderer table td {
          border: 1px solid var(--border-color);
          padding: 0.5em 1em;
        }

        .markdown-renderer table th {
          background-color: var(--bg-secondary);
          font-weight: 600;
        }

        .markdown-renderer a {
          color: var(--primary-color);
          text-decoration: none;
        }

        .markdown-renderer a:hover {
          text-decoration: underline;
        }

        .markdown-renderer hr {
          border: none;
          border-top: 1px solid var(--border-color);
          margin: 2em 0;
        }
      `}</style>
    </div>
  )
}
