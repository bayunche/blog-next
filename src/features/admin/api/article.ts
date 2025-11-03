/**
 * 文章管理 API
 */

import request from '@shared/api/axios'

/**
 * 文章管理列表参数
 */
export interface ArticleManageParams {
  page?: number
  pageSize?: number
  keyword?: string
  categoryId?: number
  tagId?: number
  status?: 'draft' | 'published'
}

/**
 * 文章管理列表项
 */
export interface ArticleMusicConfig {
  server: string
  type: string
  id: string
  autoplay?: boolean
  lrcType?: number | string | null
}

export interface ArticleManageItem {
  id: number
  title: string
  content?: string
  summary?: string
  coverImage?: string
  category?: { id: number; name: string }
  tags?: Array<{ id: number; name: string }>
  status: 'draft' | 'published'
  viewCount: number
  likeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
  music?: ArticleMusicConfig | null
}

/**
 * 文章管理列表响应
 */
export interface ArticleManageResponse {
  list: ArticleManageItem[]
  total: number
  page: number
  pageSize: number
}

/**
 * 创建/更新文章参数
 */
export interface ArticleFormData {
  title: string
  content: string
  summary?: string
  coverImage?: string
  categoryId?: number
  tagIds?: number[]
  status?: 'draft' | 'published'
  music?: ArticleMusicConfig | null
}

/**
 * 获取文章管理列表
 */
export const getArticleManageListAPI = (params?: ArticleManageParams): Promise<ArticleManageResponse> => {
  return request.get('/admin/article/list', { params })
}

/**
 * 获取文章详情（编辑用）
 */
export const getArticleManageDetailAPI = (id: number): Promise<ArticleManageItem> => {
  return request.get(`/admin/article/${id}`)
}

/**
 * 创建文章
 */
export const createArticleAPI = (data: ArticleFormData): Promise<ArticleManageItem> => {
  return request.post('/admin/article', data)
}

/**
 * 更新文章
 */
export const updateArticleAPI = (id: number, data: ArticleFormData): Promise<ArticleManageItem> => {
  return request.put(`/admin/article/${id}`, data)
}

/**
 * 删除文章
 */
export const deleteArticleAPI = (id: number): Promise<void> => {
  return request.delete(`/admin/article/${id}`)
}

/**
 * 批量删除文章
 */
export const batchDeleteArticlesAPI = (ids: number[]): Promise<void> => {
  return request.post('/admin/article/batch-delete', { ids })
}

/**
 * 发布文章
 */
export const publishArticleAPI = (id: number): Promise<ArticleManageItem> => {
  return request.put(`/admin/article/${id}/publish`)
}

/**
 * 批量发布文章
 */
export const batchPublishArticlesAPI = (ids: number[]): Promise<void> => {
  return request.post('/admin/article/batch-publish', { ids })
}

/**
 * 文章转为草稿
 */
export const unpublishArticleAPI = (id: number): Promise<ArticleManageItem> => {
  return request.put(`/admin/article/${id}/unpublish`)
}

/**
 * 批量导出文章
 */
export const batchExportArticlesAPI = async (ids: number[]): Promise<void> => {
  const { downloadArticles } = await import('@shared/utils/download')
  return downloadArticles(ids)
}

/**
 * 导出所有文章
 */
export const exportAllArticlesAPI = async (): Promise<void> => {
  const { downloadAllArticles } = await import('@shared/utils/download')
  return downloadAllArticles()
}

/**
 * 批量更新文章状态
 */
export interface BatchUpdateStatusParams {
  ids: number[]
  type?: boolean // true: 公开, false: 私密
  top?: boolean // true: 置顶, false: 取消置顶
}

export const batchUpdateArticleStatusAPI = (params: BatchUpdateStatusParams): Promise<void> => {
  return request.put('/admin/article/batch-status', params)
}

/**
 * 上传图片
 */
export const uploadImageAPI = (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
