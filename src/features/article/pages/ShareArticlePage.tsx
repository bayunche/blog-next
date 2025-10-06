/**
 * Share article page rendered via shared UUID.
 */

import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Button, Card, Col, Divider, message, Row, Space, Spin, Tag, Typography } from 'antd'
import {
  CalendarOutlined,
  CommentOutlined,
  EyeOutlined,
  LikeOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useShareArticle } from '../hooks'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { TableOfContents } from '../components/TableOfContents'
import { CommentList } from '@features/comment'

const { Title, Text } = Typography

export function ShareArticlePage() {
  const { uuid } = useParams<{ uuid: string }>()

  const {
    data: shareData,
    isLoading,
    error,
  } = useShareArticle({
    uuid: uuid || '',
    enabled: Boolean(uuid),
    retry: false,
  })

  const article = shareData?.article
  const articleId = article?.id ?? 0

  const shareLink = useMemo(() => {
    if (!uuid) {
      return ''
    }

    if (typeof window === 'undefined') {
      return `/article/share/${uuid}`
    }

    return `${window.location.origin}/article/share/${uuid}`
  }, [uuid])

  const handleCopyLink = async () => {
    if (!shareLink) {
      return
    }

    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      message.warning(
        '\u5f53\u524d\u73af\u5883\u4e0d\u652f\u6301\u81ea\u52a8\u590d\u5236\uff0c\u8bf7\u624b\u52a8\u590d\u5236\u94fe\u63a5'
      )
      return
    }

    try {
      await navigator.clipboard.writeText(shareLink)
      message.success('\u94fe\u63a5\u5df2\u590d\u5236')
    } catch (copyError) {
      console.error(copyError)
      message.error('\u590d\u5236\u5931\u8d25\uff0c\u8bf7\u624b\u52a8\u590d\u5236\u94fe\u63a5')
    }
  }

  if (!uuid) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert message="\u5206\u4eab\u94fe\u63a5\u65e0\u6548" type="error" showIcon />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert
          message="\u5206\u4eab\u5185\u5bb9\u52a0\u8f7d\u5931\u8d25"
          description={error.message}
          type="error"
          showIcon
        />
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
        <Spin size="large" tip="\u52a0\u8f7d\u4e2d..." />
      </div>
    )
  }

  if (!article) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert
          message="\u5206\u4eab\u5185\u5bb9\u4e0d\u5b58\u5728\u6216\u5df2\u5931\u6548"
          type="warning"
          showIcon
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={18}>
          <Card
            type="inner"
            style={{ marginBottom: '1.5rem' }}
            title={
              <Space>
                <ShareAltOutlined />
                <span>\u5206\u4eab\u4fe1\u606f</span>
              </Space>
            }
            extra={
              shareLink ? (
                <Button type="link" onClick={handleCopyLink}>
                  \u590d\u5236\u94fe\u63a5
                </Button>
              ) : null
            }
          >
            <Space direction="vertical" size="small">
              <Text type="secondary">\u5206\u4eab\u7f16\u53f7\uff1a{shareData?.uuid}</Text>
              <Text type="secondary">
                \u521b\u5efa\u65f6\u95f4\uff1a{dayjs(article.createdAt).format('YYYY-MM-DD HH:mm')}
              </Text>
              {shareLink && <Text copyable>{shareLink}</Text>}
            </Space>
          </Card>

          <div style={{ marginBottom: '2rem' }}>
            <Title level={1} style={{ marginBottom: '1rem' }}>
              {article.title}
            </Title>

            <Space
              wrap
              split={<span style={{ color: 'var(--border-color)' }}>|</span>}
              style={{ marginBottom: '1rem' }}
            >
              <Text type="secondary">
                <CalendarOutlined /> {dayjs(article.createdAt).format('YYYY-MM-DD HH:mm')}
              </Text>
              <Text type="secondary">
                <EyeOutlined /> {article.viewCount} \u6b21\u9605\u8bfb
              </Text>
              <Text type="secondary">
                <LikeOutlined /> {article.likeCount} \u70b9\u8d5e
              </Text>
              <Text type="secondary">
                <CommentOutlined /> {article.commentCount} \u8bc4\u8bba
              </Text>
            </Space>

            <Space wrap>
              {article.category ? <Tag color="magenta">{article.category.name}</Tag> : null}
              {article.tags?.map(tag => (
                <Tag key={tag.id} color="blue">
                  {tag.name}
                </Tag>
              ))}
            </Space>
          </div>

          <Divider />

          <div style={{ marginBottom: '2rem' }}>
            <MarkdownRenderer content={article.content || ''} />
          </div>

          <Divider />

          {articleId > 0 ? <CommentList articleId={articleId} /> : null}
        </Col>

        <Col xs={24} lg={6}>
          <TableOfContents content={article.content || ''} />
        </Col>
      </Row>
    </div>
  )
}

export default ShareArticlePage
