/**
 * TanStack Query Keys 定义
 * 统一管理所有查询键，便于缓存管理和失效控制
 *
 * 约定：
 * - 使用数组形式定义查询键
 * - 使用层级结构组织（从通用到具体）
 * - 支持参数化查询键（传入过滤条件、ID等）
 */

/**
 * 文章相关查询键
 */
export const articleKeys = {
  /** 所有文章 */
  all: ['articles'] as const,

  /** 文章列表（所有） */
  lists: () => [...articleKeys.all, 'list'] as const,

  /** 文章列表（带参数） */
  list: (filters?: Record<string, any>) => [...articleKeys.lists(), filters] as const,

  /** 文章详情（所有） */
  details: () => [...articleKeys.all, 'detail'] as const,

  /** 文章详情（指定ID） */
  detail: (id: string | number) => [...articleKeys.details(), id] as const,

  /** 文章归档 */
  archives: () => [...articleKeys.all, 'archives'] as const,

  /** 按分类查询文章 */
  byCategory: (categoryId: string | number) =>
    [...articleKeys.all, 'category', categoryId] as const,

  /** 按标签查询文章 */
  byTag: (tagName: string) => [...articleKeys.all, 'tag', tagName] as const,

  /** 分享文章（UUID） */
  share: (uuid: string) => [...articleKeys.all, 'share', uuid] as const,
}

/**
 * 用户相关查询键
 */
export const userKeys = {
  /** 所有用户 */
  all: ['users'] as const,

  /** 当前登录用户 */
  current: () => [...userKeys.all, 'current'] as const,

  /** 用户详情 */
  detail: (id: string | number) => [...userKeys.all, 'detail', id] as const,

  /** 用户贡献统计 */
  contributions: () => [...userKeys.all, 'contributions'] as const,

  /** 用户列表（管理后台） */
  list: (filters?: Record<string, any>) => [...userKeys.all, 'list', filters] as const,
}

/**
 * 评论相关查询键
 */
export const commentKeys = {
  /** 所有评论 */
  all: ['comments'] as const,

  /** 按文章查询评论 */
  byArticle: (articleId: string | number) =>
    [...commentKeys.all, 'article', articleId] as const,

  /** 按用户查询评论 */
  byUser: (userId: string | number) => [...commentKeys.all, 'user', userId] as const,

  /** 评论列表（管理后台） */
  list: (filters?: Record<string, any>) => [...commentKeys.all, 'list', filters] as const,

  /** 最近评论 */
  recent: (limit?: number) => [...commentKeys.all, 'recent', limit] as const,
}

/**
 * 分类相关查询键
 */
export const categoryKeys = {
  /** 所有分类 */
  all: ['categories'] as const,

  /** 分类列表 */
  list: () => [...categoryKeys.all, 'list'] as const,

  /** 分类详情 */
  detail: (id: string | number) => [...categoryKeys.all, 'detail', id] as const,

  /** 按名称查询分类 */
  byName: (name: string) => [...categoryKeys.all, 'name', name] as const,
}

/**
 * 标签相关查询键
 */
export const tagKeys = {
  /** 所有标签 */
  all: ['tags'] as const,

  /** 标签列表 */
  list: () => [...tagKeys.all, 'list'] as const,

  /** 标签详情 */
  detail: (id: string | number) => [...tagKeys.all, 'detail', id] as const,

  /** 标签云 */
  cloud: () => [...tagKeys.all, 'cloud'] as const,
}

/**
 * 碎片/说说相关查询键
 */
export const fragmentKeys = {
  /** 所有碎片 */
  all: ['fragments'] as const,

  /** 碎片列表 */
  lists: () => [...fragmentKeys.all, 'list'] as const,

  /** 碎片列表（带参数） */
  list: (filters?: Record<string, any>) => [...fragmentKeys.lists(), filters] as const,

  /** 碎片详情 */
  detail: (id: string | number) => [...fragmentKeys.all, 'detail', id] as const,
}

/**
 * 统计数据查询键
 */
export const statisticsKeys = {
  /** 所有统计 */
  all: ['statistics'] as const,

  /** 网站统计（PV/UV等） */
  site: () => [...statisticsKeys.all, 'site'] as const,

  /** 文章统计 */
  articles: () => [...statisticsKeys.all, 'articles'] as const,

  /** 用户统计 */
  users: () => [...statisticsKeys.all, 'users'] as const,

  /** 评论统计 */
  comments: () => [...statisticsKeys.all, 'comments'] as const,
}

/**
 * 认证相关查询键
 */
export const authKeys = {
  /** 所有认证 */
  all: ['auth'] as const,

  /** 用户信息 */
  userInfo: () => [...authKeys.all, 'userInfo'] as const,

  /** GitHub OAuth 状态 */
  github: () => [...authKeys.all, 'github'] as const,
}

/**
 * 配置相关查询键
 */
export const configKeys = {
  /** 所有配置 */
  all: ['config'] as const,

  /** 网站配置 */
  site: () => [...configKeys.all, 'site'] as const,

  /** 主题配置 */
  theme: () => [...configKeys.all, 'theme'] as const,
}

/**
 * 统一导出所有查询键
 * 方便集中管理和使用
 */
export const queryKeys = {
  articles: articleKeys,
  users: userKeys,
  comments: commentKeys,
  categories: categoryKeys,
  tags: tagKeys,
  fragments: fragmentKeys,
  statistics: statisticsKeys,
  auth: authKeys,
  config: configKeys,
} as const

/**
 * 默认导出
 */
export default queryKeys