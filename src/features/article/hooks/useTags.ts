/**
 * 标签相关 Hook
 * 使用 TanStack Query 获取标签数据
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getTagsAPI, getTagDetailAPI } from '../api'
import type { Tag, ArticleListResponse } from '../types'

/**
 * 标签列表 Hook
 *
 * @example
 * ```tsx
 * const { data: tags, isLoading } = useTags()
 * ```
 */
export function useTags(
  options?: Omit<UseQueryOptions<Tag[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Tag[], Error>({
    queryKey: ['tags'],
    queryFn: getTagsAPI,
    staleTime: 1000 * 60 * 10, // 10 分钟内数据保持新鲜
    ...options,
  })
}

/**
 * 标签详情 Hook 配置
 */
export interface UseTagDetailOptions
  extends Omit<
    UseQueryOptions<{ tag: Tag; articles: ArticleListResponse }, Error>,
    'queryKey' | 'queryFn'
  > {
  /** 标签名称 */
  name: string
}

/**
 * 标签详情 Hook（包含该标签下的文章）
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useTagDetail({ name: 'TypeScript' })
 * const { tag, articles } = data || {}
 * ```
 */
export function useTagDetail(options: UseTagDetailOptions) {
  const { name, ...queryOptions } = options

  return useQuery<{ tag: Tag; articles: ArticleListResponse }, Error>({
    queryKey: ['tag', name],
    queryFn: () => getTagDetailAPI(name),
    staleTime: 1000 * 60 * 5, // 5 分钟内数据保持新鲜
    enabled: !!name, // 只有当 name 存在时才执行查询
    ...queryOptions,
  })
}
