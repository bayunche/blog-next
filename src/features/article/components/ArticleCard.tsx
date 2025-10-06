/**
 * 文章卡片组件
 * 用于展示文章列表项
 */

import { Card, Tag, Space, Typography } from 'antd'
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

const { Title, Paragraph, Text } = Typography

/**
 * 文章卡片 Props
 */
export interface ArticleCardProps {
  /** 文章数据 */
  article: ArticleListItem
  /** 是否显示封面 */
  showCover?: boolean
}

/**
 * 文章卡片组件
 */
export function ArticleCard({ article, showCover = true }: ArticleCardProps) {
  const {
    id,
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

  return (
    <Link to={`/article/${id}`} style={{ textDecoration: 'none' }}>
      <Card
        hoverable
        cover={
          cover ? (
            <div className={styles.coverWrapper}>
              <div
                className={styles.coverImage}
                style={{
                  backgroundImage: `url(${cover})`,
                }}
              />
            </div>
          ) : (
            <div className={styles.coverWrapper}>
              <div className={styles.coverPlaceholder}>
                <span>暂无封面</span>
              </div>
            </div>
          )
        }
        className={styles.articleCard}
        styles={{ body: { padding: 'var(--spacing-md)' } }}
      >
        {/* 标题 */}
        <Title level={3} className={styles.title}>
          {title}
        </Title>

        {/* 描述 */}
        <Paragraph ellipsis={{ rows: 2 }} className={styles.description}>
          {description}
        </Paragraph>

        {/* 元信息 */}
        <div className={styles.metaWrapper}>
          <Space size="small" className={styles.meta}>
            <Text type="secondary">
              <CalendarOutlined /> {dayjs(createdAt).format('MMM DD, YYYY')}
            </Text>
            <span className={styles.divider}>·</span>
            <Text type="secondary">
              <EyeOutlined /> {viewCount}
            </Text>
          </Space>

          {/* 分类和标签 */}
          <Space size={4} className={styles.tags}>
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
