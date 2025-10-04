/**
 * 文章模块 API
 */

import request from '@shared/utils/request'
import type {
  ArticleListParams,
  ArticleListResponse,
  ArticleDetailParams,
  ArticleDetail,
  ShareArticle,
  LikeArticleParams,
  LikeArticleResponse,
  ArchiveData,
  Category,
  Tag,
  ArticleListItem,
} from '../types'

/**
 * 转换后端文章数据格式为前端格式
 * 后端返回 categories 数组和 tags 数组，前端期望 category 对象和 tags 数组
 */
function transformArticle(article: any): ArticleListItem {
  return {
    ...article,
    // 后端返回 categories 数组，取第一个作为 category
    category: article.categories?.[0] || { id: 0, name: '未分类' },
    // 后端返回 tags 数组，保持原样
    tags: article.tags || [],
    // 计算评论数
    commentCount: article.comments?.length || 0,
    // 默认值
    likeCount: article.likeCount || 0,
    description: article.description || article.content?.slice(0, 200) || '',
  }
}

/**
 * 获取文章列表
 */
export const getArticleListAPI = async (
  params?: ArticleListParams
): Promise<ArticleListResponse> => {
  // 将 orderBy 和 order 合并为后端期望的 order 参数
  const { orderBy, order: orderDirection, ...restParams } = params || {}
  const requestParams = {
    ...restParams,
    // 如果有 orderBy，则合并为 "field direction" 格式
    ...(orderBy && orderDirection ? { order: `${orderBy} ${orderDirection}` } : {}),
  }

  // 后端返回 { rows, count } 格式，转换为前端期望的格式
  const response: any = await request.get('/article/list', {
    params: requestParams,
  })

  const page = Number(params?.page) || 1
  const pageSize = Number(params?.pageSize) || 10
  const total = response.count || 0
  const totalPages = Math.ceil(total / pageSize)

  // 转换后端数据格式
  const list = (response.rows || []).map(transformArticle)

  return {
    list,
    total,
    page,
    pageSize,
    totalPages,
  }
}

/**
 * 获取文章详情
 */
export const getArticleDetailAPI = async (
  params: ArticleDetailParams
): Promise<ArticleDetail> => {
  const response: any = await request.get(`/article/${params.id}`)
  return transformArticle(response) as ArticleDetail
}

/**
 * 获取分享文章详情（通过 UUID）
 */
export const getShareArticleAPI = async (uuid: string): Promise<ShareArticle> => {
  const response: any = await request.get(`/article/share/${uuid}`)
  return {
    ...response,
    article: transformArticle(response.article) as ArticleDetail,
  }
}

/**
 * 点赞文章
 */
export const likeArticleAPI = (
  params: LikeArticleParams
): Promise<LikeArticleResponse> => {
  return request.post(`/article/${params.id}/like`)
}

/**
 * 取消点赞文章
 */
export const unlikeArticleAPI = (
  params: LikeArticleParams
): Promise<LikeArticleResponse> => {
  return request.delete(`/article/${params.id}/like`)
}

/**
 * 获取所有分类
 */
export const getCategoriesAPI = (): Promise<Category[]> => {
  return request.get('/category/list')
}

/**
 * 获取分类详情（包含文章列表）
 */
export const getCategoryDetailAPI = (name: string): Promise<{
  category: Category
  articles: ArticleListResponse
}> => {
  return request.get(`/category/${name}`)
}

/**
 * 获取所有标签
 */
export const getTagsAPI = (): Promise<Tag[]> => {
  return request.get('/tag/list')
}

/**
 * 获取标签详情（包含文章列表）
 */
export const getTagDetailAPI = (name: string): Promise<{
  tag: Tag
  articles: ArticleListResponse
}> => {
  return request.get(`/tag/${name}`)
}

/**
 * 获取归档数据
 */
export const getArchivesAPI = (): Promise<ArchiveData> => {
  return request.get('/article/archives')
}

/**
 * 搜索文章
 */
export const searchArticlesAPI = async (
  keyword: string,
  params?: Omit<ArticleListParams, 'keyword'>
): Promise<ArticleListResponse> => {
  const response: any = await request.get('/article/search', {
    params: { ...params, keyword },
  })

  const page = Number(params?.page) || 1
  const pageSize = Number(params?.pageSize) || 10
  const total = response.count || 0
  const totalPages = Math.ceil(total / pageSize)

  // 转换后端数据格式
  const list = (response.rows || []).map(transformArticle)

  return {
    list,
    total,
    page,
    pageSize,
    totalPages,
  }
}
