/**
 * 文章模块 API
 */

import request from '@shared/api/axios'
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
  ArticleMusic,
} from '../types'

type NormalizedArticle = ArticleListItem & {
  content?: string
  music?: ArticleMusic | null
  references?: ArticleDetail['references']
}

const normalizeContent = (input: unknown): string => {
  if (input == null) return ''
  if (typeof input === 'string') return input
  if (Array.isArray(input)) {
    return input.map((item) => normalizeContent(item)).join('')
  }
  if (typeof input === 'object') {
    const value = (input as any).value ?? (input as any).text ?? ''
    if (typeof value === 'string') {
      return value
    }
    const children = (input as any).children
    if (Array.isArray(children)) {
      return normalizeContent(children)
    }
    return ''
  }
  return String(input)
}

const normalizeReferences = (input: unknown): ArticleDetail['references'] => {
  if (!Array.isArray(input)) {
    return []
  }

  return input
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null
      }
      const title =
        typeof (item as any).title === 'string'
          ? (item as any).title.trim()
          : ''
      const url = typeof (item as any).url === 'string' ? (item as any).url : ''
      if (!url) {
        return null
      }
      return {
        title: title || url,
        url,
      }
    })
    .filter(Boolean) as ArticleDetail['references']
}

/**
 * 转换后端文章数据格式为前端格式
 * 后端返回 categories 数组和 tags 数组，前端期望 category 对象和 tags 数组
 */
function transformArticle(article: any): NormalizedArticle {
  const contentExists = typeof article?.content !== 'undefined'
  const normalizedContent = normalizeContent(article?.content)
  const descriptionSource =
    typeof article?.description === 'string'
      ? article.description
      : normalizedContent

  const transformed: NormalizedArticle = {
    ...article,
    // 后端返回 categories 数组，取第一个作为 category
    category: article?.categories?.[0] || { id: 0, name: '未分类' },
    // 后端返回 tags 数组，保持原样
    tags: article?.tags || [],
    // 计算评论数
    commentCount: Array.isArray(article?.comments) ? article.comments.length : 0,
    // 默认值
    likeCount: article?.likeCount || 0,
    description: (descriptionSource || '').toString().slice(0, 200),
  }

  if (contentExists) {
    transformed.content = normalizedContent
  }

  if (Array.isArray(article?.references)) {
    transformed.references = normalizeReferences(article.references)
  }

  if (article?.music) {
    transformed.music = article.music as ArticleMusic
  }

  return transformed
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

  // 后端返回 { list, total, page, pageSize } 格式
  const response: any = await request.get('/article/list', {
    params: requestParams,
  })

  console.log('[DEBUG] getArticleListAPI RAW response:', {
    responseType: typeof response,
    responseKeys: Object.keys(response || {}),
    response: JSON.stringify(response).slice(0, 200),
    hasList: !!response.list,
    hasRows: !!response.rows,
    listType: typeof response.list,
    listIsArray: Array.isArray(response.list),
    listLength: response.list?.length,
    rowsLength: response.rows?.length,
    total: response.total,
    count: response.count
  })

  const page = Number(params?.page) || 1
  const pageSize = Number(params?.pageSize) || 10
  // 修复：后端返回 total 而不是 count
  const total = response.total || 0
  const totalPages = Math.ceil(total / pageSize)

  // 修复：后端返回 list 而不是 rows
  // 添加类型安全检查
  const rawList = response.list || []
  console.log('[DEBUG] rawList check:', {
    rawListType: typeof rawList,
    rawListIsArray: Array.isArray(rawList),
    rawListValue: JSON.stringify(rawList).slice(0, 100)
  })

  // 确保 list 是数组
  if (!Array.isArray(rawList)) {
    console.error('[ERROR] response.list is not an array:', {
      type: typeof rawList,
      value: rawList
    })
    // 返回空列表而非抛出错误
    return {
      list: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
    }
  }

  const list = rawList.map(transformArticle)

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
  const { id, slug, locale } = params
  if (!id && !slug) {
    throw new Error('Article identifier (id or slug) is required')
  }

  const endpoint = slug ? `/article/slug/${slug}` : `/article/${id}`
  const response: any = await request.get(endpoint, {
    params: locale ? { locale } : undefined,
  })

  const transformed = transformArticle(response) as ArticleDetail
  transformed.content = normalizeContent(response?.content)
  transformed.references = normalizeReferences(response?.references)
  transformed.music = response?.music ? (response.music as ArticleMusic) : transformed.music ?? null
  return transformed
}

/**
 * 获取分享文章详情（通过 UUID）
 */
export const getShareArticleAPI = async (uuid: string): Promise<ShareArticle> => {
  const response: any = await request.get(`/article/share/${uuid}`)
  return {
    ...response,
    article: (() => {
      const transformed = transformArticle(response.article) as ArticleDetail
      transformed.content = normalizeContent(response?.article?.content)
      transformed.references = normalizeReferences(response?.article?.references)
      transformed.music = response?.article?.music
        ? (response.article.music as ArticleMusic)
        : transformed.music ?? null
      return transformed
    })(),
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
