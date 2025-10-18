/**
 * Admin dashboard API
 */

import request from '@shared/api/axios'
import type { DashboardResponse } from '../types'

export interface ArticleTrendRecord {
  date: string
  count: number
}

/**
 * 获取仪表盘总览数据
 */
export const getDashboardOverviewAPI = (): Promise<DashboardResponse> => {
  return request.get('/admin/dashboard/overview')
}

/**
 * 获取文章阅读趋势
 */
export const getArticleTrendAPI = async (): Promise<ArticleTrendRecord[]> => {
  const response = await request.get('/admin/dashboard/article-trend')
  return Array.isArray(response) ? response : []
}