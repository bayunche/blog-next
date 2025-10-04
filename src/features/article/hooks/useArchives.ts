/**
 * 归档相关 Hook
 * 使用 TanStack Query 获取归档数据
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getArchivesAPI } from '../api'
import type { ArchiveData } from '../types'

/**
 * 归档数据 Hook
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useArchives()
 * const { years, total } = data || {}
 * ```
 */
export function useArchives(
  options?: Omit<UseQueryOptions<ArchiveData, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ArchiveData, Error>({
    queryKey: ['archives'],
    queryFn: getArchivesAPI,
    staleTime: 1000 * 60 * 10, // 10 分钟内数据保持新鲜
    ...options,
  })
}
