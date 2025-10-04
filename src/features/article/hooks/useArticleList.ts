/**
 * 文章列表 Hook
 * 使用 TanStack Query 获取文章列表
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getArticleListAPI } from '../api'
import type { ArticleListParams, ArticleListResponse } from '../types'

/**
 * 文章列表 Hook 配置
 */
export interface UseArticleListOptions
  extends Omit<
    UseQueryOptions<ArticleListResponse, Error>,
    'queryKey' | 'queryFn'
  > {
  /** 查询参数 */
  params?: ArticleListParams
}

/**
 * 文章列表 Hook
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useArticleList({
 *   params: { page: 1, pageSize: 10, categoryId: 1 }
 * })
 * ```
 */
export function useArticleList(options?: UseArticleListOptions) {
  const { params, ...queryOptions } = options || {}

  return useQuery<ArticleListResponse, Error>({
    queryKey: ['articles', params],
    queryFn: () => getArticleListAPI(params),
    staleTime: 1000 * 60 * 5, // 5 分钟内数据保持新鲜
    ...queryOptions,
  })
}
