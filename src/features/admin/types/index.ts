/**
 * 绠＄悊鍚庡彴绫诲瀷瀹氫箟
 */

import { ReactNode } from 'react'

/**
 * 鑿滃崟椤规帴鍙?
 */
export interface MenuItem {
  /** 璺緞 */
  path: string
  /** 鍥炬爣 */
  icon?: ReactNode
  /** 鍚嶇О */
  name: string
  /** 鏄惁闅愯棌 */
  hidden?: boolean
  /** 瀛愯彍鍗?*/
  children?: MenuItem[]
}

/**
 * 浠〃鐩樼粺璁℃暟鎹?
 */
export interface DashboardStats {
  /** 鏂囩珷鎬绘暟 */
  articleCount: number
  /** 鐢ㄦ埛鎬绘暟 */
  userCount: number
  /** 璇勮鎬绘暟 */
  commentCount: number
  /** 娴忚鎬绘暟 */
  viewCount: number
}

/**
 * 鏈�鏂版枃绔?
 */
export interface RecentArticle {
  id: number
  title: string
  createdAt: string
  viewCount: number
  likeCount: number
}

/**
 * 浠〃鐩樻暟鎹搷搴?
 */
export interface DashboardResponse {
  stats: DashboardStats
  recentArticles: RecentArticle[]
  chartData?: {
    dates: string[]
    views: number[]
    likes: number[]
  }
}

/**
 * 文章统计记录
 */
export interface ArticleAnalyticsRecord {
  articleId: number
  articleLabel: string
  date: string
  count: number
}

/**
 * 文章统计汇总信息
 */
export interface ArticleAnalyticsSummary {
  totalReads: number
  uniqueArticles: number
  startDate?: string
  endDate?: string
  topArticles: Array<{ articleId: number; articleLabel: string; total: number }>
}

/**
 * 文章统计数据
 */
export interface ArticleAnalyticsData {
  records: ArticleAnalyticsRecord[]
  summary: ArticleAnalyticsSummary
}
