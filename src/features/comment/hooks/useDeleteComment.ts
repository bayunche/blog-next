/**
 * 删除评论/回复 Hook
 * 使用 TanStack Query Mutation 处理删除操作
 */

import { createElement } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { deleteCommentAPI, deleteReplyAPI } from '../api'
import type { DeleteCommentParams, DeleteReplyParams } from '../types'

/**
 * 删除评论 Hook 配置
 */
export interface UseDeleteCommentOptions {
  /** 文章 ID */
  articleId: number
  /** 成功回调 */
  onSuccess?: () => void
  /** 失败回调 */
  onError?: (error: Error) => void
}

/**
 * 删除评论 Hook
 *
 * @example
 * ```tsx
 * const { deleteComment, isDeleting } = useDeleteComment({
 *   articleId: 1,
 *   onSuccess: () => console.log('删除成功')
 * })
 *
 * // 删除评论
 * deleteComment(commentId)
 * ```
 */
export function useDeleteComment(options: UseDeleteCommentOptions) {
  const { articleId, onSuccess, onError } = options
  const queryClient = useQueryClient()

  // 删除评论 Mutation
  const deleteMutation = useMutation({
    mutationFn: (params: DeleteCommentParams) => deleteCommentAPI(params),

    onSuccess: () => {
      // 刷新评论列表
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] })
      message.success('删除成功')
      onSuccess?.()
    },

    onError: (error: Error) => {
      message.error(error.message || '删除失败')
      onError?.(error)
    },
  })

  /**
   * 删除评论（带确认提示）
   */
  const deleteComment = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      icon: createElement(ExclamationCircleOutlined),
      content: '确定要删除这条评论吗？删除后无法恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteMutation.mutate({ id })
      },
    })
  }

  return {
    /** 删除评论 */
    deleteComment,

    /** 是否正在删除 */
    isDeleting: deleteMutation.isPending,

    /** Mutation 状态 */
    mutation: deleteMutation,
  }
}

/**
 * 删除回复 Hook 配置
 */
export interface UseDeleteReplyOptions {
  /** 文章 ID */
  articleId: number
  /** 成功回调 */
  onSuccess?: () => void
  /** 失败回调 */
  onError?: (error: Error) => void
}

/**
 * 删除回复 Hook
 *
 * @example
 * ```tsx
 * const { deleteReply, isDeleting } = useDeleteReply({
 *   articleId: 1,
 *   onSuccess: () => console.log('删除成功')
 * })
 *
 * // 删除回复
 * deleteReply(replyId)
 * ```
 */
export function useDeleteReply(options: UseDeleteReplyOptions) {
  const { articleId, onSuccess, onError } = options
  const queryClient = useQueryClient()

  // 删除回复 Mutation
  const deleteMutation = useMutation({
    mutationFn: (params: DeleteReplyParams) => deleteReplyAPI(params),

    onSuccess: () => {
      // 刷新评论列表
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] })
      message.success('删除成功')
      onSuccess?.()
    },

    onError: (error: Error) => {
      message.error(error.message || '删除失败')
      onError?.(error)
    },
  })

  /**
   * 删除回复（带确认提示）
   */
  const deleteReply = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      icon: createElement(ExclamationCircleOutlined),
      content: '确定要删除这条回复吗？删除后无法恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        deleteMutation.mutate({ id })
      },
    })
  }

  return {
    /** 删除回复 */
    deleteReply,

    /** 是否正在删除 */
    isDeleting: deleteMutation.isPending,

    /** Mutation 状态 */
    mutation: deleteMutation,
  }
}
