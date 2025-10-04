/**
 * 创建评论 Hook
 * 使用 TanStack Query Mutation 处理评论创建
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { createCommentAPI, createReplyAPI } from '../api'
import type { CreateCommentParams, CreateReplyParams } from '../types'

/**
 * 创建评论 Hook 配置
 */
export interface UseCreateCommentOptions {
  /** 文章 ID */
  articleId: number
  /** 成功回调 */
  onSuccess?: () => void
  /** 失败回调 */
  onError?: (error: Error) => void
}

/**
 * 创建评论 Hook
 *
 * @example
 * ```tsx
 * const { createComment, isCreating } = useCreateComment({
 *   articleId: 1,
 *   onSuccess: () => console.log('评论成功')
 * })
 *
 * // 创建评论
 * createComment({ content: '这是一条评论' })
 * ```
 */
export function useCreateComment(options: UseCreateCommentOptions) {
  const { articleId, onSuccess, onError } = options
  const queryClient = useQueryClient()

  // 创建评论 Mutation
  const commentMutation = useMutation({
    mutationFn: (data: Omit<CreateCommentParams, 'articleId'>) =>
      createCommentAPI({ ...data, articleId }),

    onSuccess: () => {
      // 刷新评论列表
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] })
      message.success('评论成功')
      onSuccess?.()
    },

    onError: (error: Error) => {
      message.error(error.message || '评论失败')
      onError?.(error)
    },
  })

  return {
    /** 创建评论 */
    createComment: (content: string) =>
      commentMutation.mutate({ content }),

    /** 是否正在创建 */
    isCreating: commentMutation.isPending,

    /** Mutation 状态 */
    mutation: commentMutation,
  }
}

/**
 * 创建回复 Hook 配置
 */
export interface UseCreateReplyOptions {
  /** 文章 ID */
  articleId: number
  /** 成功回调 */
  onSuccess?: () => void
  /** 失败回调 */
  onError?: (error: Error) => void
}

/**
 * 创建回复 Hook
 *
 * @example
 * ```tsx
 * const { createReply, isCreating } = useCreateReply({
 *   articleId: 1,
 *   onSuccess: () => console.log('回复成功')
 * })
 *
 * // 创建回复
 * createReply({
 *   commentId: 1,
 *   content: '这是一条回复',
 *   toUserId: 2
 * })
 * ```
 */
export function useCreateReply(options: UseCreateReplyOptions) {
  const { articleId, onSuccess, onError } = options
  const queryClient = useQueryClient()

  // 创建回复 Mutation
  const replyMutation = useMutation({
    mutationFn: (data: CreateReplyParams) => createReplyAPI(data),

    onSuccess: () => {
      // 刷新评论列表
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] })
      message.success('回复成功')
      onSuccess?.()
    },

    onError: (error: Error) => {
      message.error(error.message || '回复失败')
      onError?.(error)
    },
  })

  return {
    /** 创建回复 */
    createReply: (data: CreateReplyParams) => replyMutation.mutate(data),

    /** 是否正在创建 */
    isCreating: replyMutation.isPending,

    /** Mutation 状态 */
    mutation: replyMutation,
  }
}
