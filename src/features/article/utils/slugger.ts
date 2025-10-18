/**
 * 创建一个用于生成唯一锚点的函数。
 * 对于重复标题会自动追加计数后缀，保证页面内 id 唯一。
 */
export const createSlugger = () => {
  const cache = new Map<string, number>()

  return (rawText: string) => {
    const baseText = rawText.trim().toLowerCase()
    const normalized = baseText
      .replace(/[\s]+/g, ' ')
      .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$/g, '') || 'section'

    const count = cache.get(normalized) ?? 0
    cache.set(normalized, count + 1)

    return count === 0 ? normalized : `${normalized}-${count}`
  }
}

/**
 * 抽取 React Markdown 标题节点的纯文本。
 */
export const extractHeadingText = (children: any): string => {
  if (typeof children === 'string') {
    return children
  }

  if (Array.isArray(children)) {
    return children.map(extractHeadingText).join('')
  }

  if (children?.props?.children) {
    return extractHeadingText(children.props.children)
  }

  return ''
}
