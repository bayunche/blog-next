/**
 * 分类页面
 * 展示所有文章分类
 */

import { Row, Col, Card, Spin, Alert, Typography, Statistic } from 'antd'
import { FolderOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useCategories } from '../hooks'

const { Title } = Typography

/**
 * 分类卡片组件
 */
interface CategoryCardProps {
  id: number
  name: string
  articleCount: number
}

function CategoryCard({ id, name, articleCount }: CategoryCardProps) {
  return (
    <Link to={`/categories/${name}`} style={{ textDecoration: 'none' }}>
      <Card
        hoverable
        className="category-card"
        style={{
          height: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            color: 'var(--primary-color)',
          }}
        >
          <FolderOutlined />
        </div>

        <Title level={4} style={{ marginBottom: '1rem' }}>
          {name}
        </Title>

        <Statistic
          title="文章数"
          value={articleCount || 0}
          suffix="篇"
          valueStyle={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}
        />
      </Card>
    </Link>
  )
}

/**
 * 分类页面组件
 */
export function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()

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
      {/* 页面标题 */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Title level={1}>
          <FolderOutlined /> 文章分类
        </Title>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          共 {categories?.length || 0} 个分类
        </p>
      </div>

      {/* 分类网格 */}
      <Row gutter={[24, 24]}>
        {categories?.map((category) => (
          <Col key={category.id} xs={24} sm={12} md={8} lg={6}>
            <CategoryCard
              id={category.id}
              name={category.name}
              articleCount={category.articleCount || 0}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default CategoriesPage
