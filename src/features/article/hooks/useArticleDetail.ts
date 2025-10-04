/**
 * 文章详情 Hook
 * 使用 TanStack Query 获取文章详情
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getArticleDetailAPI, getShareArticleAPI } from '../api'
import type { ArticleDetail, ShareArticle } from '../types'

/**
 * 文章详情 Hook 配置
 */
export interface UseArticleDetailOptions
  extends Omit<UseQueryOptions<ArticleDetail, Error>, 'queryKey' | 'queryFn'> {
  /** 文章 ID */
  id: number
}

/**
 * 文章详情 Hook
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useArticleDetail({ id: 1 })
 * ```
 */
export function useArticleDetail(options: UseArticleDetailOptions) {
  const { id, ...queryOptions } = options

  return useQuery<ArticleDetail, Error>({
    queryKey: ['article', id],
    queryFn: () => getArticleDetailAPI({ id }),
    staleTime: 1000 * 60 * 5, // 5 分钟内数据保持新鲜
    enabled: !!id, // 只有当 id 存在时才执行查询
    ...queryOptions,
  })
}

/**
 * 分享文章 Hook 配置
 */
export interface UseShareArticleOptions
  extends Omit<UseQueryOptions<ShareArticle, Error>, 'queryKey' | 'queryFn'> {
  /** 分享 UUID */
  uuid: string
}

/**
 * 分享文章 Hook
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useShareArticle({ uuid: 'xxx-xxx-xxx' })
 * ```
 */
export function useShareArticle(options: UseShareArticleOptions) {
  const { uuid, ...queryOptions } = options

  return useQuery<ShareArticle, Error>({
    queryKey: ['shareArticle', uuid],
    queryFn: () => getShareArticleAPI(uuid),
    staleTime: 1000 * 60 * 10, // 10 分钟内数据保持新鲜
    enabled: !!uuid, // 只有当 uuid 存在时才执行查询
    ...queryOptions,
  })
}
