/**
 * 归档页面
 * 按时间线展示所有文章
 */

import { Timeline, Spin, Alert, Typography, Space, Tag } from 'antd'
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useArchives } from '../hooks'

const { Title, Text } = Typography

/**
 * 归档页面组件
 */
export function ArchivesPage() {
  const { data: archives, isLoading, error } = useArchives()

  // 错误处理
  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert
          message="加载失败"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    )
  }

  // 加载状态
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  if (!archives || archives.length === 0) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          暂无归档文章
        </div>
      </div>
    )
  }

  // 计算总文章数
  const totalArticles = archives.reduce(
    (total, yearData) =>
      total +
      yearData.months.reduce((monthTotal, monthData) => monthTotal + monthData.articles.length, 0),
    0
  )

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Title level={1}>
          <ClockCircleOutlined /> 文章归档
        </Title>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          共 {totalArticles} 篇文章
        </p>
      </div>

      {/* 归档时间线 */}
      {archives.map((yearData) => {
        const yearArticleCount = yearData.months.reduce(
          (total, monthData) => total + monthData.articles.length,
          0
        )

        return (
          <div key={yearData.year} style={{ marginBottom: '3rem' }}>
            {/* 年份标题 */}
            <div
              style={{
                marginBottom: '1.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid var(--border-color)',
              }}
            >
              <Title level={2} style={{ marginBottom: '0.25rem' }}>
                <CalendarOutlined /> {yearData.year}
              </Title>
              <Text type="secondary">{yearArticleCount} 篇文章</Text>
            </div>

            {/* 月份时间线 */}
            <Timeline
              items={yearData.months.map((monthData) => ({
                color: 'blue',
                children: (
                  <div key={`${yearData.year}-${monthData.month}`}>
                    {/* 月份标题 */}
                    <Title level={4} style={{ marginTop: 0, marginBottom: '1rem' }}>
                      {monthData.month} 月
                      <Tag color="blue" style={{ marginLeft: '0.5rem' }}>
                        {monthData.articles.length} 篇
                      </Tag>
                    </Title>

                    {/* 文章列表 */}
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      {monthData.articles.map((article) => (
                        <div
                          key={article.id}
                          style={{
                            padding: '1rem',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateX(8px)'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateX(0)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          {/* 文章标题 */}
                          <Link
                            to={`/article/${article.id}`}
                            style={{
                              fontSize: '1.1rem',
                              fontWeight: 500,
                              color: 'var(--text-primary)',
                              textDecoration: 'none',
                            }}
                          >
                            {article.title}
                          </Link>

                          {/* 文章元信息 */}
                          <div
                            style={{
                              marginTop: '0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              flexWrap: 'wrap',
                            }}
                          >
                            {/* 发布日期 */}
                            <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                              {dayjs(article.createdAt).format('MM-DD')}
                            </Text>

                            {/* 分类 */}
                            {article.category && (
                              <Link
                                to={`/categories/${article.category.name}`}
                                style={{ textDecoration: 'none' }}
                              >
                                <Tag color="orange">{article.category.name}</Tag>
                              </Link>
                            )}

                            {/* 标签 */}
                            {article.tags && article.tags.length > 0 && (
                              <>
                                {article.tags.slice(0, 3).map((tag) => (
                                  <Link
                                    key={tag.id}
                                    to={`/tags/${tag.name}`}
                                    style={{ textDecoration: 'none' }}
                                  >
                                    <Tag color="blue">{tag.name}</Tag>
                                  </Link>
                                ))}
                              </>
                            )}

                            {/* 浏览数 */}
                            {article.viewCount !== undefined && (
                              <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                                👁️ {article.viewCount}
                              </Text>
                            )}

                            {/* 点赞数 */}
                            {article.likeCount !== undefined && (
                              <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                                ❤️ {article.likeCount}
                              </Text>
                            )}
                          </div>
                        </div>
                      ))}
                    </Space>
                  </div>
                ),
              }))}
            />
          </div>
        )
      })}
    </div>
  )
}

export default ArchivesPage
