/**
 * 文章列表页面
 * 展示所有文章，支持分页与筛选。
 */
import { useState } from 'react'
import { Row, Col, Pagination, Spin, Empty, Alert } from 'antd'
import { useArticleList } from '../hooks'
import { ArticleCard, GithubContribution } from '../components'
import { Sidebar, QuickNav } from '@shared/components'

/**
 * 文章列表页面组件
 */
export function ArticleListPage() {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  const { data, isLoading, error } = useArticleList({
    params: {
      page,
      pageSize,
      orderBy: 'createdAt',
      order: 'DESC',
    },
  })

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert message="加载失败" description={error.message} type="error" showIcon />
      </div>
    )
  }

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

  if (!data || data.list.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <Empty description="暂无文章" />
      </div>
    )
  }

  return (
    <div
      style={{
        padding: 'var(--spacing-2xl) var(--spacing-lg)',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Row gutter={[48, 0]}>
        <Col xs={24} md={6} lg={6}>
          <div style={{ position: 'sticky', top: 'var(--spacing-2xl)' }}>
            <Sidebar />
          </div>
        </Col>

        <Col xs={24} md={18} lg={18}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xl)' }}>
            {data.list.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 'var(--spacing-2xl)',
                paddingTop: 'var(--spacing-xl)',
              }}
            >
              <Pagination
                current={page}
                pageSize={pageSize}
                total={data.total}
                onChange={setPage}
                showSizeChanger={false}
                showTotal={(total) => `共 ${total} 篇文章`}
              />
            </div>
          )}
        </Col>
      </Row>

      <QuickNav articles={data.list} />
      <GithubContribution />
    </div>
  )
}

export default ArticleListPage
