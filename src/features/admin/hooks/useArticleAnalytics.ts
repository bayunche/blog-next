/**
 * Admin article analytics hook built on TanStack Query
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { getArticleRecordsAPI, type RawArticleRecord } from '../api/record'
import type { ArticleAnalyticsData, ArticleAnalyticsRecord } from '../types'

const analyticsQueryKey = ['admin', 'article-analytics'] as const

function normalizeRecord(raw: RawArticleRecord): ArticleAnalyticsRecord | null {
  const articleIdNumber = Number(raw.articleId)
  if (Number.isNaN(articleIdNumber)) {
    return null
  }

  const parsedDate = dayjs(raw.time)
  if (!parsedDate.isValid()) {
    return null
  }

  const countNumber = Number(raw.cnt)

  return {
    articleId: articleIdNumber,
    articleLabel: `文章 #${articleIdNumber}`,
    date: parsedDate.format('YYYY-MM-DD'),
    count: Number.isFinite(countNumber) ? countNumber : 0,
  }
}

function buildAnalyticsData(rawRecords: RawArticleRecord[]): ArticleAnalyticsData {
  const records: ArticleAnalyticsRecord[] = []

  rawRecords.forEach((item) => {
    const record = normalizeRecord(item)
    if (record) {
      records.push(record)
    }
  })

  records.sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())

  const totalsByArticle = new Map<number, { articleLabel: string; total: number }>()
  let totalReads = 0

  records.forEach((record) => {
    totalReads += record.count
    const existing = totalsByArticle.get(record.articleId)
    if (existing) {
      existing.total += record.count
    } else {
      totalsByArticle.set(record.articleId, {
        articleLabel: record.articleLabel,
        total: record.count,
      })
    }
  })

  const topArticles = Array.from(totalsByArticle.entries())
    .map(([articleId, value]) => ({ articleId, articleLabel: value.articleLabel, total: value.total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  return {
    records,
    summary: {
      totalReads,
      uniqueArticles: totalsByArticle.size,
      startDate: records[0]?.date,
      endDate: records[records.length - 1]?.date,
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
      const raw = await getArticleRecordsAPI()
      return buildAnalyticsData(raw)
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export default useArticleAnalytics
