/**
 * 标签页面
 * 展示所有文章标签（标签云）
 */

import { Spin, Alert, Typography } from 'antd'
import { TagsOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useTags } from '../hooks'

const { Title } = Typography

/**
 * 标签云组件
 */
function TagCloud() {
  const { data: tags, isLoading, error } = useTags()

  // 错误处理
  if (error) {
    return (
      <Alert
        message="加载失败"
        description={error.message}
        type="error"
        showIcon
      />
    )
  }

  // 加载状态
  if (isLoading) {
    return <Spin size="large" tip="加载中..." />
  }

  if (!tags || tags.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
        暂无标签
      </div>
    )
  }

  // 计算标签字体大小（根据文章数量）
  const maxCount = Math.max(...tags.map((tag) => tag.articleCount || 0))
  const minCount = Math.min(...tags.map((tag) => tag.articleCount || 1))

  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 1.2

    // 归一化到 0.8 - 2.5 rem
    const normalized = (count - minCount) / (maxCount - minCount)
    return 0.8 + normalized * 1.7
  }

  // 生成随机颜色
  const colors = [
    '#f50',
    '#2db7f5',
    '#87d068',
    '#108ee9',
    '#f5222d',
    '#fa8c16',
    '#faad14',
    '#52c41a',
    '#13c2c2',
    '#1677ff',
    '#722ed1',
    '#eb2f96',
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {tags.map((tag, index) => {
        const fontSize = getFontSize(tag.articleCount || 0)
        const color = colors[index % colors.length]

        return (
          <Link
            key={tag.id}
            to={`/tags/${tag.name}`}
            style={{
              textDecoration: 'none',
              fontSize: `${fontSize}rem`,
              color,
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.3s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)'
              e.currentTarget.style.textShadow = '0 2px 8px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.textShadow = 'none'
            }}
          >
            {tag.name} ({tag.articleCount || 0})
          </Link>
        )
      })}
    </div>
  )
}

/**
 * 标签页面组件
 */
export function TagsPage() {
  const { data: tags } = useTags()

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Title level={1}>
          <TagsOutlined /> 文章标签
        </Title>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          共 {tags?.length || 0} 个标签
        </p>
      </div>

      {/* 标签云 */}
      <TagCloud />
    </div>
  )
}

export default TagsPage
