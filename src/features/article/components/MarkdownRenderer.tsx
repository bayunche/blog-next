/**
 * Markdown 渲染器组件
 * 使用 react-markdown 渲染 Markdown 内容，支持代码高亮
 */

import React, { useEffect, useRef, useMemo } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'highlight.js/styles/github-dark.css' // 代码高亮主题
import './markdown.less'
import { createSlugger, extractHeadingText } from '../utils/slugger'

/**
 * Markdown 渲染器 Props
 */
export interface MarkdownRendererProps {
  /** Markdown 内容 */
  content: string
  /** 自定义 className */
  className?: string
}

const isMdxCodeBlock = (node: any) => node?.type === 'element' && node?.tagName === 'code'

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
  const sluggerRef = useRef(createSlugger())

  useEffect(() => {
    sluggerRef.current = createSlugger()
  }, [content])

  const renderHeading = (level: number) => ({ children }: { children: ReactNode }) => {
    return React.createElement(
      `h${level}`,
      { id: sluggerRef.current(extractHeadingText(children)) },
      children,
    )
  }

  const renderCodeBlock = useMemo(() => {
    return ({ node, inline, className, children, ...props }: any) => {
      const text = String(children).replace(/\n$/, '')
      const languageClass = className || node?.properties?.className?.join(' ')
      const match = /language-(\w+)/.exec(languageClass || '')
      const language = match?.[1] || (node && isMdxCodeBlock(node) ? node.properties?.className?.[0]?.split('-')?.[1] : 'text')

      if (inline) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        )
      }

      return (
        <div className="code-block">
          <div className="code-header">
            <strong>{language?.toUpperCase()}</strong>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(text)
                } catch (error) {
                  console.warn('复制失败', error)
                }
              }}
            >
              复制
            </button>
          </div>
          <pre {...props}>
            <code className={languageClass}>{text}</code>
          </pre>
        </div>
      )
    }
  }, [])

  return (
    <div className={`markdown-renderer ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />, // 自定义链接在新窗口打开
          img: ({ node, ...props }) => (
            <img
              {...props}
              style={{ maxWidth: '100%', height: 'auto' }}
              loading="lazy"
            />
          ),
          h1: renderHeading(1),
          h2: renderHeading(2),
          h3: renderHeading(3),
          h4: renderHeading(4),
          h5: renderHeading(5),
          h6: renderHeading(6),
          code: renderCodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer
