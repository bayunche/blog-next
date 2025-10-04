/**
 * 文章详情页面
 * 展示文章完整内容，支持点赞、评论等交互
 */

import { useParams, Link } from 'react-router-dom'
import {
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Spin,
  Alert,
  Divider,
} from 'antd'
import {
  EyeOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useArticleDetail, useLikeArticle } from '../hooks'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { TableOfContents } from '../components/TableOfContents'
import { CommentList } from '@features/comment'

const { Title, Text } = Typography

/**
 * 文章详情页面
 */
export function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const articleId = parseInt(id || '0', 10)

  // 获取文章详情
  const { data: article, isLoading, error } = useArticleDetail({ id: articleId })

  // 点赞功能
  const { likeArticle, unlikeArticle, isLiking } = useLikeArticle()

  // 处理点赞
  const handleLike = () => {
    if (!article) return
    if (article.isLiked) {
      unlikeArticle(articleId)
    } else {
      likeArticle(articleId)
    }
  }

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

  // 文章不存在
  if (!article) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert message="文章不存在" type="warning" showIcon />
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* 主内容区 */}
        <Col xs={24} lg={18}>
          {/* 文章头部 */}
          <div style={{ marginBottom: '2rem' }}>
            {/* 标题 */}
            <Title level={1} style={{ marginBottom: '1rem' }}>
              {article.title}
            </Title>

            {/* 元信息 */}
            <Space
              wrap
              split={<span style={{ color: 'var(--border-color)' }}>|</span>}
              style={{ marginBottom: '1rem' }}
            >
              <Text type="secondary">
                <CalendarOutlined />{' '}
                {dayjs(article.createdAt).format('YYYY-MM-DD HH:mm')}
              </Text>
              <Text type="secondary">
                <EyeOutlined /> {article.viewCount} 次阅读
              </Text>
              <Text type="secondary">
                <LikeOutlined /> {article.likeCount} 点赞
              </Text>
              <Text type="secondary">
                <CommentOutlined /> {article.commentCount} 评论
              </Text>
            </Space>

            {/* 分类和标签 */}
            <Space wrap>
              {article.category && (<Tag color="magenta">{article.category.name}</Tag>)}
              {article.tags && article.tags.length > 0 && article.tags.map((tag) => (
                <Tag key={tag.id} color="blue">
                  {tag.name}
                </Tag>
              ))}
            </Space>
          </div>

          <Divider />

          {/* 文章内容 */}
          <div style={{ marginBottom: '2rem' }}>
            <MarkdownRenderer content={article.content} />
          </div>

          <Divider />

          {/* 操作按钮 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
            }}
          >
            <Button
              type={article.isLiked ? 'primary' : 'default'}
              icon={article.isLiked ? <LikeFilled /> : <LikeOutlined />}
              size="large"
              loading={isLiking}
              onClick={handleLike}
            >
              {article.isLiked ? '已点赞' : '点赞'} ({article.likeCount})
            </Button>
          </div>

          {/* 上一篇/下一篇 */}
          {(article.prev || article.next) && (
            <>
              <Divider />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                {article.prev ? (
                  <Link
                    to={`/article/${article.prev.id}`}
                    style={{ flex: 1, textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <Text type="secondary">
                        <LeftOutlined /> 上一篇
                      </Text>
                      <div style={{ marginTop: '0.5rem' }}>
                        {article.prev.title}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div style={{ flex: 1 }} />
                )}

                {article.next ? (
                  <Link
                    to={`/article/${article.next.id}`}
                    style={{ flex: 1, textDecoration: 'none' }}
                  >
                    <div
                      style={{
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'right',
                      }}
                    >
                      <Text type="secondary">
                        下一篇 <RightOutlined />
                      </Text>
                      <div style={{ marginTop: '0.5rem' }}>
                        {article.next.title}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div style={{ flex: 1 }} />
                )}
              </div>
            </>
          )}

          {/* 评论区 */}
          <CommentList articleId={articleId} />
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} lg={6}>
          {/* 目录 */}
          <TableOfContents content={article.content} />
        </Col>
      </Row>
    </div>
  )
}

export default ArticleDetailPage
