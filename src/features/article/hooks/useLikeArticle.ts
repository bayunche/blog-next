/**
 * 文章点赞 Hook
 * 使用 TanStack Query Mutation 处理点赞操作
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { likeArticleAPI, unlikeArticleAPI } from '../api'
import type { LikeArticleParams } from '../types'
import { useTranslation } from 'react-i18next'

/**
 * 点赞文章 Hook 配置
 */
export interface UseLikeArticleOptions {
  /** 成功回调 */
  onSuccess?: () => void
  /** 失败回调 */
  onError?: (error: Error) => void
}

/**
 * 点赞文章 Hook
 *
 * @example
 * ```tsx
 * const { likeArticle, unlikeArticle, isLiking } = useLikeArticle({
 *   onSuccess: () => console.log('操作成功')
 * })
 *
 * // 点赞
 * likeArticle(articleId)
 *
 * // 取消点赞
 * unlikeArticle(articleId)
 * ```
 */
export function useLikeArticle(options?: UseLikeArticleOptions) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('article')

  // 点赞 Mutation
  const likeMutation = useMutation({
    mutationFn: (params: LikeArticleParams) => likeArticleAPI(params),

    onSuccess: (response, variables) => {
      if (response.success === false) {
        message.error(t('messages.likeFailed'))
        return
      }

      // 乐观更新：立即更新缓存中的文章详情

      queryClient.invalidateQueries({ queryKey: ['article'] })

      message.success(t('messages.likeSuccess'))
      options?.onSuccess?.()
    },

    onError: (error: Error) => {
      message.error(error.message || t('messages.likeFailed'))
      options?.onError?.(error)
    },
  })

  // 取消点赞 Mutation
  const unlikeMutation = useMutation({
    mutationFn: (params: LikeArticleParams) => unlikeArticleAPI(params),

    onSuccess: (response, variables) => {
      if (response.success === false) {
        message.error(t('messages.operationFailed'))
        return
      }

      // 乐观更新：立即更新缓存中的文章详情
      queryClient.invalidateQueries({ queryKey: ['article'] })

      message.success(t('messages.unlikeSuccess'))
      options?.onSuccess?.()
    },

    onError: (error: Error) => {
      message.error(error.message || t('messages.operationFailed'))
      options?.onError?.(error)
    },
  })

  return {
    /** 点赞文章 */
    likeArticle: (id: number) => likeMutation.mutate({ id }),

    /** 取消点赞文章 */
    unlikeArticle: (id: number) => unlikeMutation.mutate({ id }),

    /** 是否正在处理 */
    isLiking: likeMutation.isPending || unlikeMutation.isPending,

    /** 点赞状态 */
    likeMutation,

    /** 取消点赞状态 */
    unlikeMutation,
  }
}
