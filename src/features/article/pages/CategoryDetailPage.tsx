/**
 * 分类详情页面
 * 显示某个分类下的所有文章
 */

import { useParams, Link } from 'react-router-dom'
import { Row, Col, Card, Spin, Alert, Typography, Breadcrumb, Empty } from 'antd'
import { FolderOutlined, HomeOutlined } from '@ant-design/icons'
import { useCategoryDetail } from '../hooks'
import { ArticleCard } from '../components/ArticleCard'

const { Title, Text } = Typography

/**
 * 分类详情页面
 */
export function CategoryDetailPage() {
  const { name } = useParams<{ name: string }>()
  const categoryName = decodeURIComponent(name || '')

  // 获取分类详情
  const { data, isLoading, error } = useCategoryDetail({ name: categoryName })

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

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 面包屑导航 */}
      <Breadcrumb
        style={{ marginBottom: '2rem' }}
        items={[
          {
            href: '/',
            title: (
              <>
                <HomeOutlined />
                <span>首页</span>
              </>
            ),
          },
          {
            href: '/categories',
            title: (
              <>
                <FolderOutlined />
                <span>分类</span>
              </>
            ),
          },
          {
            title: categoryName,
          },
        ]}
      />

      {/* 页面标题 */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Title level={1}>
          <FolderOutlined /> {categoryName}
        </Title>
        <Text type="secondary" style={{ fontSize: '1rem' }}>
          共 {data?.articles?.total || 0} 篇文章
        </Text>
      </div>

      {/* 文章列表 */}
      {data?.articles?.list && data.articles.list.length > 0 ? (
        <Row gutter={[24, 24]}>
          {data.articles.list.map((article) => (
            <Col key={article.id} xs={24} sm={12} lg={8}>
              <ArticleCard article={article} />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="该分类暂无文章" />
      )}
    </div>
  )
}

export default CategoryDetailPage
