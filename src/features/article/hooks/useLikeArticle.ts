/**
 * 文章点赞 Hook
 * 使用 TanStack Query Mutation 处理点赞操作
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import { likeArticleAPI, unlikeArticleAPI } from '../api'
import type { LikeArticleParams, ArticleDetail } from '../types'

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

  // 点赞 Mutation
  const likeMutation = useMutation({
    mutationFn: (params: LikeArticleParams) => likeArticleAPI(params),

    onSuccess: (response, variables) => {
      // 乐观更新：立即更新缓存中的文章详情
      queryClient.setQueryData<ArticleDetail>(
        ['article', variables.id],
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            likeCount: response.likeCount,
            isLiked: response.isLiked,
          }
        }
      )

      message.success('点赞成功')
      options?.onSuccess?.()
    },

    onError: (error: Error) => {
      message.error(error.message || '点赞失败')
      options?.onError?.(error)
    },
  })

  // 取消点赞 Mutation
  const unlikeMutation = useMutation({
    mutationFn: (params: LikeArticleParams) => unlikeArticleAPI(params),

    onSuccess: (response, variables) => {
      // 乐观更新：立即更新缓存中的文章详情
      queryClient.setQueryData<ArticleDetail>(
        ['article', variables.id],
        (oldData) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            likeCount: response.likeCount,
            isLiked: response.isLiked,
          }
        }
      )

      message.success('已取消点赞')
      options?.onSuccess?.()
    },

    onError: (error: Error) => {
      message.error(error.message || '操作失败')
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
