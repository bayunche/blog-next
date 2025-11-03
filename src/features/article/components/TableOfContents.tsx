/**
 * 文章目录组件
 * 从 Markdown 内容中提取标题生成目录导航
 */

import { useEffect, useState } from 'react'
import { Anchor } from 'antd'
import type { TocItem } from '../types'
import { useTranslation } from 'react-i18next'
import { createSlugger } from '../utils/slugger'
import './TableOfContents.less'

/**
 * 目录组件 Props
 */
export interface TableOfContentsProps {
  /** Markdown 内容 */
  content: string
  /** 自定义 className */
  className?: string
}

/**
 * 从 Markdown 内容提取目录
 */
function extractToc(content: string): TocItem[] {
  // 空值检查
  if (!content || typeof content !== 'string') {
    return []
  }

  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const toc: TocItem[] = []
  const slugger = createSlugger()
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const anchor = slugger(text)

    toc.push({
      level,
      text,
      anchor,
    })
  }

  return toc
}

/**
 * 将扁平的目录转换为树形结构
 */
function buildTocTree(items: TocItem[]): TocItem[] {
  const tree: TocItem[] = []
  const stack: TocItem[] = []

  items.forEach((item) => {
    const newItem = { ...item, children: [] }

    // 找到父节点
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      tree.push(newItem)
    } else {
      const parent = stack[stack.length - 1]
      if (!parent.children) parent.children = []
      parent.children.push(newItem)
    }

    stack.push(newItem)
  })

  return tree
}

/**
 * 目录组件
 *
 * @example
 * ```tsx
 * <TableOfContents content={article.content} />
 * ```
 */
export function TableOfContents({
  content,
  className = '',
}: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeAnchor, setActiveAnchor] = useState<string>('')
  const { t } = useTranslation('article')

  useEffect(() => {
    const items = extractToc(content)
    const tree = buildTocTree(items)
    setToc(tree)

    const headingElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.markdown-renderer h1, .markdown-renderer h2, .markdown-renderer h3'
      )
    )

    if (headingElements.length === 0) {
      setActiveAnchor('')
      return undefined
    }

    setActiveAnchor(headingElements[0]?.id ?? '')

    const entryMap = new Map<string, IntersectionObserverEntry>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          if (id) {
            entryMap.set(id, entry)
          }
        })

        let nextActive = headingElements[0]?.id ?? ''

        for (const heading of headingElements) {
          const entry = entryMap.get(heading.id)
          if (!entry) {
            continue
          }

          if (entry.isIntersecting || entry.boundingClientRect.top <= 0) {
            nextActive = heading.id
          } else if (entry.boundingClientRect.top > 0 && !entry.isIntersecting) {
            break
          }
        }

        setActiveAnchor((prev) => (prev === nextActive ? prev : nextActive))
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: [0, 0.15, 0.4],
      }
    )

    headingElements.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [content])

  // 将目录转换为 Ant Design Anchor 的格式
  const convertToAnchorItems = (items: TocItem[]): any[] => {
    return items.map((item) => ({
      key: item.anchor,
      href: `#${item.anchor}`,
      title: item.text,
      children: item.children ? convertToAnchorItems(item.children) : undefined,
    }))
  }

  if (toc.length === 0) {
    return null
  }

  return (
    <div className={`table-of-contents ${className}`}>
      <div className="table-of-contents__title">{t('toc.title')}</div>
      <Anchor
        affix={false}
        items={convertToAnchorItems(toc)}
        getCurrentAnchor={() => (activeAnchor ? `#${activeAnchor}` : '')}
      />
    </div>
  )
}
