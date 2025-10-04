/**
 * 评论表单组件
 * 用于发布评论或回复
 */

import { useState } from 'react'
import { Input, Button, Space } from 'antd'
import { useAuthStore } from '@shared/stores'
import { useCreateComment, useCreateReply } from '../hooks'
import type { CommentUser } from '../types'

const { TextArea } = Input

/**
 * 评论表单 Props
 */
export interface CommentFormProps {
  /** 文章 ID */
  articleId: number
  /** 评论 ID（用于回复） */
  commentId?: number
  /** 被回复用户信息 */
  toUser?: CommentUser
  /** 提交成功回调 */
  onSuccess?: () => void
  /** 取消回调 */
  onCancel?: () => void
  /** 占位符文本 */
  placeholder?: string
}

/**
 * 评论表单组件
 */
export function CommentForm({
  articleId,
  commentId,
  toUser,
  onSuccess,
  onCancel,
  placeholder = '发表你的评论...',
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const { isAuthenticated } = useAuthStore()

  // 根据是否有 commentId 来判断是评论还是回复
  const isReply = !!commentId

  // 创建评论 Hook
  const { createComment, isCreating: isCreatingComment } = useCreateComment({
    articleId,
    onSuccess: () => {
      setContent('')
      onSuccess?.()
    },
  })

  // 创建回复 Hook
  const { createReply, isCreating: isCreatingReply } = useCreateReply({
    articleId,
    onSuccess: () => {
      setContent('')
      onSuccess?.()
    },
  })

  const isLoading = isCreatingComment || isCreatingReply

  // 处理提交
  const handleSubmit = () => {
    if (!content.trim()) {
      return
    }

    if (isReply && commentId) {
      // 创建回复
      createReply({
        commentId,
        content: content.trim(),
        toUserId: toUser?.id,
      })
    } else {
      // 创建评论
      createComment(content.trim())
    }
  }

  // 处理取消
  const handleCancel = () => {
    setContent('')
    onCancel?.()
  }

  if (!isAuthenticated()) {
    return (
      <div
        style={{
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        请先登录后再发表评论
      </div>
    )
  }

  return (
    <div className="comment-form">
      {/* 回复提示 */}
      {isReply && toUser && (
        <div
          style={{
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
          }}
        >
          回复 @{toUser.username}:
        </div>
      )}

      {/* 输入框 */}
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={4}
        maxLength={500}
        showCount
        disabled={isLoading}
      />

      {/* 操作按钮 */}
      <Space style={{ marginTop: '0.75rem' }}>
        <Button
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
          disabled={!content.trim()}
        >
          {isReply ? '发布回复' : '发布评论'}
        </Button>

        {isReply && onCancel && (
          <Button onClick={handleCancel} disabled={isLoading}>
            取消
          </Button>
        )}
      </Space>
    </div>
  )
}
