/**
 * 文章卡片组件
 * 用于展示文章列表项
 */

import { Card, Tag, Space, Typography, Tooltip } from 'antd'
import {
  EyeOutlined,
  LikeOutlined,
  CommentOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import type { ArticleListItem } from '../types'
import dayjs from 'dayjs'
import styles from './ArticleCard.module.less'

const { Title, Paragraph } = Typography

export interface ArticleCardProps {
  article: ArticleListItem
  showCover?: boolean
}

export function ArticleCard({ article }: ArticleCardProps) {
  const {
    id,
    slug,
    title,
    description,
    cover,
    viewCount,
    likeCount,
    commentCount,
    category,
    tags,
    createdAt,
  } = article

  const articleHref = slug ? `/posts/${slug}` : `/article/${id}`

  return (
    <Link to={articleHref} className={styles.articleLink}>
      <Card
        hoverable
        cover={
          <div className={styles.coverWrapper}>
            <div
              className={styles.coverImage}
              style={{
                backgroundImage: cover
                  ? `url(${cover})`
                  : 'linear-gradient(135deg, rgba(214, 127, 71, 0.25), rgba(214, 127, 71, 0.05))',
              }}
            />
            {!cover && (
              <div className={styles.coverPlaceholder}>
                <span>暂无封面</span>
              </div>
            )}
          </div>
        }
        className={styles.articleCard}
      >
        <Title level={3} className={styles.title}>
          {title}
        </Title>

        <Paragraph ellipsis={{ rows: 2 }} className={styles.description}>
          {description}
        </Paragraph>

        <div className={styles.metaWrapper}>
          <div className={styles.metaStats}>
            <Tooltip title="发布时间">
              <span className={styles.statItem}>
                <CalendarOutlined />
                {dayjs(createdAt).format('MMM DD, YYYY')}
              </span>
            </Tooltip>
            <Tooltip title="阅读量">
              <span className={styles.statItem}>
                <EyeOutlined />
                {viewCount}
              </span>
            </Tooltip>
            <Tooltip title="点赞数">
              <span className={styles.statItem}>
                <LikeOutlined />
                {likeCount}
              </span>
            </Tooltip>
            <Tooltip title="评论数">
              <span className={styles.statItem}>
                <CommentOutlined />
                {commentCount}
              </span>
            </Tooltip>
          </div>

          <Space size={6} className={styles.tags}>
            <Tag className={styles.categoryTag}>{category.name}</Tag>
            {tags.slice(0, 2).map((tag) => (
              <Tag key={tag.id} className={styles.normalTag}>
                {tag.name}
              </Tag>
            ))}
          </Space>
        </div>
      </Card>
    </Link>
  )
}

export default ArticleCard
