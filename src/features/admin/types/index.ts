/**
 * 管理后台类型定义
 */

import { ReactNode } from 'react'

/**
 * 菜单项接口
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
  /** 子菜单 */
  children?: MenuItem[]
}

/**
 * 仪表盘统计数据
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
 * 最新文章
 */
export interface RecentArticle {
  id: number
  title: string
  createdAt: string
  viewCount: number
  likeCount: number
}

/**
 * 仪表盘数据响应
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
