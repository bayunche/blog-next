/**
 * Admin article analytics API
 */

import request from '@shared/utils/request'

export interface RawArticleRecord {
  articleId: number | string
  time: string
  cnt: number | string
}

/**
 * 获取文章阅读记录
 */
export const getArticleRecordsAPI = async (): Promise<RawArticleRecord[]> => {
  const response = await request.get('/record')
  return Array.isArray(response) ? response : []
}
