/**
 * 评论列表组件
 * 展示文章的所有评论
 */

import { Divider, Empty, Spin, Alert, Typography } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import { useComments } from '../hooks'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'

const { Title } = Typography

/**
 * 评论列表 Props
 */
export interface CommentListProps {
  /** 文章 ID */
  articleId: number
}

/**
 * 评论列表组件
 */
export function CommentList({ articleId }: CommentListProps) {
  // 获取评论列表
  const { data, isLoading, error } = useComments({
    params: { articleId, page: 1, pageSize: 100 },
  })

  // 错误处理
  if (error) {
    return (
      <div style={{ marginTop: '2rem' }}>
        <Alert
          message="评论加载失败"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    )
  }

  return (
    <div className="comment-list" style={{ marginTop: '2rem' }}>
      {/* 标题 */}
      <Title level={3}>
        <MessageOutlined /> 评论{' '}
        {!isLoading && data && <span>({data.total})</span>}
      </Title>

      <Divider />

      {/* 发表评论表单 */}
      <div style={{ marginBottom: '2rem' }}>
        <CommentForm articleId={articleId} />
      </div>

      <Divider />

      {/* 加载状态 */}
      {isLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <Spin tip="加载评论中..." />
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && data && data.list && data.list.length === 0 && (
        <Empty
          description="暂无评论，快来发表第一条评论吧！"
          style={{ padding: '2rem' }}
        />
      )}

      {/* 评论列表 */}
      {!isLoading && data && data.list && data.list.length > 0 && (
        <div>
          {data.list.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleId={articleId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
