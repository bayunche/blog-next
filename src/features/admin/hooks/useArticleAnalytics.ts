/**
 * Admin article analytics hook built on TanStack Query
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { getArticleTrendAPI, type ArticleTrendRecord } from '../api/dashboard'
import type { ArticleAnalyticsData } from '../types'

const analyticsQueryKey = ['admin', 'article-analytics'] as const

function buildAnalyticsData(records: ArticleTrendRecord[]): ArticleAnalyticsData {
  const sortedRecords = [...records].sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())

  const totalReads = sortedRecords.reduce((sum, record) => sum + record.count, 0)

  // Since the new API doesn't provide per-article data, we leave topArticles empty.
  const topArticles: ArticleAnalyticsData['summary']['topArticles'] = []

  return {
    records: sortedRecords.map((r) => ({ ...r, articleLabel: '所有文章' })),
    summary: {
      totalReads,
      uniqueArticles: 0, // This info is not available in the new API
      startDate: sortedRecords[0]?.date,
      endDate: sortedRecords[sortedRecords.length - 1]?.date,
      topArticles,
    },
  }
}

export const useArticleAnalytics = (
  options?: UseQueryOptions<ArticleAnalyticsData, Error, ArticleAnalyticsData>,
) => {
  return useQuery<ArticleAnalyticsData, Error>({
    queryKey: analyticsQueryKey,
    queryFn: async () => {
      const raw = await getArticleTrendAPI()
      return buildAnalyticsData(raw)
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export default useArticleAnalytics
