/**
 * TanStack Query 缓存策略配置
 * 定义不同数据类型的 staleTime 和 gcTime
 */

/**
 * 数据新鲜时间配置（staleTime）
 * 数据在该时间内被认为是"新鲜的"，不会重新请求
 */
export const QUERY_STALE_TIME = {
  /** 实时数据（立即过期） */
  REALTIME: 0,
  /** 频繁变化（30秒） */
  FREQUENT: 1000 * 30,
  /** 普通数据（2分钟） */
  NORMAL: 1000 * 60 * 2,
  /** 不常变化（10分钟） */
  STABLE: 1000 * 60 * 10,
  /** 静态数据（1小时） */
  STATIC: 1000 * 60 * 60,
} as const

/**
 * 缓存时间配置（gcTime，原 cacheTime）
 * 未使用的数据保留在内存中的时间
 */
export const QUERY_CACHE_TIME = {
  /** 短期缓存（5分钟） */
  SHORT: 1000 * 60 * 5,
  /** 中期缓存（30分钟） */
  MEDIUM: 1000 * 60 * 30,
  /** 长期缓存（2小时） */
  LONG: 1000 * 60 * 60 * 2,
  /** 永久缓存 */
  FOREVER: Infinity,
} as const

/**
 * 不同数据类型的缓存策略
 * 根据业务场景配置合适的缓存时间
 */
export const CACHE_STRATEGIES = {
  /** 文章列表 - 普通数据，中期缓存 */
  ARTICLE_LIST: {
    staleTime: QUERY_STALE_TIME.NORMAL,
    gcTime: QUERY_CACHE_TIME.MEDIUM,
  },
  /** 文章详情 - 不常变化，长期缓存 */
  ARTICLE_DETAIL: {
    staleTime: QUERY_STALE_TIME.STABLE,
    gcTime: QUERY_CACHE_TIME.LONG,
  },
  /** 用户信息 - 普通数据，中期缓存 */
  USER_INFO: {
    staleTime: QUERY_STALE_TIME.NORMAL,
    gcTime: QUERY_CACHE_TIME.MEDIUM,
  },
  /** 分类标签 - 静态数据，长期缓存 */
  CATEGORIES: {
    staleTime: QUERY_STALE_TIME.STATIC,
    gcTime: QUERY_CACHE_TIME.LONG,
  },
  /** 评论列表 - 频繁变化，短期缓存 */
  COMMENTS: {
    staleTime: QUERY_STALE_TIME.FREQUENT,
    gcTime: QUERY_CACHE_TIME.SHORT,
  },
  /** 统计数据 - 普通数据，中期缓存 */
  STATISTICS: {
    staleTime: QUERY_STALE_TIME.NORMAL,
    gcTime: QUERY_CACHE_TIME.MEDIUM,
  },
  /** 配置数据 - 静态数据，永久缓存 */
  CONFIG: {
    staleTime: QUERY_STALE_TIME.STATIC,
    gcTime: QUERY_CACHE_TIME.FOREVER,
  },
  /** 实时数据 - 立即过期，短期缓存 */
  REALTIME: {
    staleTime: QUERY_STALE_TIME.REALTIME,
    gcTime: QUERY_CACHE_TIME.SHORT,
  },
} as const

/**
 * 重试配置
 */
export const RETRY_CONFIG = {
  /** 默认重试次数 */
  DEFAULT_RETRY: 3,
  /** 最大重试延迟（毫秒） */
  MAX_RETRY_DELAY: 30000,
  /** 不需要重试的HTTP状态码 */
  NO_RETRY_STATUS: [401, 403, 404],
} as const