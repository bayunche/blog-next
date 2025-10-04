/**
 * 评论项组件
 * 展示单条评论及其回复
 */

import { useState } from 'react'
import { Avatar, Button, Space, Typography } from 'antd'
import { DeleteOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import { useAuthStore } from '@shared/stores'
import { useDeleteComment, useDeleteReply } from '../hooks'
import { CommentForm } from './CommentForm'
import type { Comment, Reply } from '../types'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const { Text } = Typography

/**
 * 评论项 Props
 */
export interface CommentItemProps {
  /** 评论数据 */
  comment: Comment
  /** 文章 ID */
  articleId: number
}

/**
 * 评论项组件
 */
export function CommentItem({ comment, articleId }: CommentItemProps) {
  const [replyingTo, setReplyingTo] = useState<Reply | null>(null)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const { user: currentUser, isAdmin } = useAuthStore()

  // 删除评论 Hook
  const { deleteComment } = useDeleteComment({ articleId })

  // 删除回复 Hook
  const { deleteReply } = useDeleteReply({ articleId })

  // 判断是否可以删除评论
  const canDeleteComment =
    comment.canDelete || currentUser?.id === comment.user.id || isAdmin()

  // 判断是否可以删除回复
  const canDeleteReply = (reply: Reply) =>
    reply.canDelete || currentUser?.id === reply.user.id || isAdmin()

  // 处理回复点击
  const handleReplyClick = (reply?: Reply) => {
    if (reply) {
      setReplyingTo(reply)
    } else {
      setReplyingTo(null)
    }
    setShowReplyForm(true)
  }

  // 回复成功回调
  const handleReplySuccess = () => {
    setShowReplyForm(false)
    setReplyingTo(null)
  }

  return (
    <div className="comment-item" style={{ marginBottom: '1.5rem' }}>
      {/* 评论主体 */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* 头像 */}
        <Avatar
          size={40}
          src={comment.user.avatar}
          icon={!comment.user.avatar && <UserOutlined />}
        />

        {/* 评论内容 */}
        <div style={{ flex: 1 }}>
          {/* 用户名和时间 */}
          <div style={{ marginBottom: '0.5rem' }}>
            <Text strong>{comment.user.username}</Text>
            {comment.user.role === 1 && (
              <span
                style={{
                  marginLeft: '0.5rem',
                  padding: '0.125rem 0.5rem',
                  background: 'var(--primary-color)',
                  color: '#fff',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                }}
              >
                作者
              </span>
            )}
            <Text type="secondary" style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>
              {dayjs(comment.createdAt).fromNow()}
            </Text>
          </div>

          {/* 评论内容 */}
          <div style={{ marginBottom: '0.75rem', whiteSpace: 'pre-wrap' }}>
            {comment.content}
          </div>

          {/* 操作按钮 */}
          <Space>
            <Button
              type="link"
              size="small"
              icon={<MessageOutlined />}
              onClick={() => handleReplyClick()}
            >
              回复
            </Button>

            {canDeleteComment && (
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteComment(comment.id)}
              >
                删除
              </Button>
            )}
          </Space>

          {/* 回复列表 */}
          {comment.replies && comment.replies.length > 0 && (
            <div
              style={{
                marginTop: '1rem',
                marginLeft: '1rem',
                borderLeft: '2px solid var(--border-color)',
                paddingLeft: '1rem',
              }}
            >
              {comment.replies.map((reply) => (
                <div
                  key={reply.id}
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {/* 回复用户和时间 */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <Text strong>{reply.user.username}</Text>
                    {reply.user.role === 1 && (
                      <span
                        style={{
                          marginLeft: '0.5rem',
                          padding: '0.125rem 0.5rem',
                          background: 'var(--primary-color)',
                          color: '#fff',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                        }}
                      >
                        作者
                      </span>
                    )}
                    {reply.toUser && (
                      <>
                        <Text type="secondary"> 回复 </Text>
                        <Text strong>@{reply.toUser.username}</Text>
                      </>
                    )}
                    <Text
                      type="secondary"
                      style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}
                    >
                      {dayjs(reply.createdAt).fromNow()}
                    </Text>
                  </div>

                  {/* 回复内容 */}
                  <div style={{ marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>
                    {reply.content}
                  </div>

                  {/* 回复操作 */}
                  <Space>
                    <Button
                      type="link"
                      size="small"
                      icon={<MessageOutlined />}
                      onClick={() => handleReplyClick(reply)}
                    >
                      回复
                    </Button>

                    {canDeleteReply(reply) && (
                      <Button
                        type="link"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteReply(reply.id)}
                      >
                        删除
                      </Button>
                    )}
                  </Space>
                </div>
              ))}
            </div>
          )}

          {/* 回复表单 */}
          {showReplyForm && (
            <div style={{ marginTop: '1rem' }}>
              <CommentForm
                articleId={articleId}
                commentId={comment.id}
                toUser={replyingTo?.user || comment.user}
                onSuccess={handleReplySuccess}
                onCancel={() => {
                  setShowReplyForm(false)
                  setReplyingTo(null)
                }}
                placeholder={
                  replyingTo
                    ? `回复 @${replyingTo.user.username}...`
                    : `回复 @${comment.user.username}...`
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
