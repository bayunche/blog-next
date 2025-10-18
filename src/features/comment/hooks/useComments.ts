/**
 * 评论列表 Hook
 * 使用 TanStack Query 获取评论列表
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getCommentsAPI } from '../api'
import type { GetCommentsParams, CommentListResponse } from '../types'

/**
 * 评论列表 Hook 配置
 */
export interface UseCommentsOptions
  extends Omit<
    UseQueryOptions<CommentListResponse, Error>,
    'queryKey' | 'queryFn'
  > {
  /** 查询参数 */
  params: GetCommentsParams
}

/**
 * 评论列表 Hook
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useComments({
 *   params: { articleId: 1, page: 1, pageSize: 20 }
 * })
 * ```
 */
export function useComments(options: UseCommentsOptions) {
  const { params, ...queryOptions } = options

  return useQuery<CommentListResponse, Error>({
    queryKey: ['comments', params.articleId, params.page, params.pageSize],
    queryFn: () => getCommentsAPI(params),
    staleTime: 1000 * 60 * 2, // 2 分钟内数据保持新鲜
    enabled: params.articleId !== undefined && params.articleId !== null,
    ...queryOptions,
  })
}
