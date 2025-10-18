/**
 * 管理后台类型定义
 */

import { ReactNode } from 'react'

/**
 * 菜单项接�?
 */
export interface MenuItem {
  /** 路径 */
  path: string
  /** 图标 */
  icon?: ReactNode
  /** 名称 */
  name: string
  /** 是否隐藏 */
  hidden?: boolean
  /** 子菜�?*/
  children?: MenuItem[]
}

/**
 * 仪表盘统计数�?
 */
export interface DashboardStats {
  /** 文章总数 */
  articleCount: number
  /** 用户总数 */
  userCount: number
  /** 评论总数 */
  commentCount: number
  /** 浏览总数 */
  viewCount: number
}

/**
 * 最新文�?
 */
export interface RecentArticle {
  id: number
  title: string
  createdAt: string
  viewCount: number
  likeCount: number
  status: 'draft' | 'published'
}

/**
 * 仪表盘数据响�?
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
 * ����ͳ�Ƽ�¼
 */
export interface ArticleAnalyticsRecord {
  articleId: number
  articleLabel: string
  date: string
  count: number
}

/**
 * ����ͳ�ƻ�����Ϣ
 */
export interface ArticleAnalyticsSummary {
  totalReads: number
  uniqueArticles: number
  startDate?: string
  endDate?: string
  topArticles: Array<{ articleId: number; articleLabel: string; total: number }>
}

/**
 * ����ͳ������
 */
export interface ArticleAnalyticsData {
  records: ArticleAnalyticsRecord[]
  summary: ArticleAnalyticsSummary
}
