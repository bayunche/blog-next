/**
 * 分类相关 Hook
 * 使用 TanStack Query 获取分类数据
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getCategoriesAPI, getCategoryDetailAPI } from '../api'
import type { Category, ArticleListResponse } from '../types'

/**
 * 分类列表 Hook
 *
 * @example
 * ```tsx
 * const { data: categories, isLoading } = useCategories()
 * ```
 */
export function useCategories(
  options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: getCategoriesAPI,
    staleTime: 1000 * 60 * 10, // 10 分钟内数据保持新鲜
    ...options,
  })
}

/**
 * 分类详情 Hook 配置
 */
export interface UseCategoryDetailOptions
  extends Omit<
    UseQueryOptions<
      { category: Category; articles: ArticleListResponse },
      Error
    >,
    'queryKey' | 'queryFn'
  > {
  /** 分类名称 */
  name: string
}

/**
 * 分类详情 Hook（包含该分类下的文章）
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useCategoryDetail({ name: 'React' })
 * const { category, articles } = data || {}
 * ```
 */
export function useCategoryDetail(options: UseCategoryDetailOptions) {
  const { name, ...queryOptions } = options

  return useQuery<{ category: Category; articles: ArticleListResponse }, Error>(
    {
      queryKey: ['category', name],
      queryFn: () => getCategoryDetailAPI(name),
      staleTime: 1000 * 60 * 5, // 5 分钟内数据保持新鲜
      enabled: !!name, // 只有当 name 存在时才执行查询
      ...queryOptions,
    }
  )
}
