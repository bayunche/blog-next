/**
 * 文章模块类型定义
 */

/**
 * 文章分类
 */
export interface Category {
  /** 分类 ID */
  id: number
  /** 分类名称 */
  name: string
  /** 文章数量 */
  articleCount?: number
}

/**
 * 文章标签
 */
export interface Tag {
  /** 标签 ID */
  id: number
  /** 标签名称 */
  name: string
  /** 文章数量 */
  articleCount?: number
}

/**
 * 文章基础信息（用于列表展示）
 */
export interface ArticleListItem {
  /** 文章 ID */
  id: number
  /** 文章标题 */
  title: string
  /** 文章 Slug */
  slug?: string
  /** 文章描述/摘要 */
  description: string
  /** 文章封面图 */
  cover?: string
  /** 浏览次数 */
  viewCount: number
  /** 点赞数 */
  likeCount: number
  /** 评论数 */
  commentCount: number
  /** 分类 */
  category: Category
  /** 标签列表 */
  tags: Tag[]
  /** 创建时间 */
  createdAt: string
  /** 更新时间 */
  updatedAt: string
}

export interface ArticleMusic {
  /** 音乐来源平台（meting 支持，如 netease、tencent、kugou 等） */
  server: string
  /** 类型，常见为 song/playlist/album */
  type: string
  /** 对应平台的资源 ID */
  id: string
  /** 是否自动播放 */
  autoplay?: boolean
  /** LRC 歌词类型 */
  lrcType?: number | string
}

/**
 * 文章详情（包含完整内容）
 */
export interface ArticleDetail extends ArticleListItem {
  /** 文章内容（Markdown） */
  content: string
  /** 作者信息 */
  author?: {
    id: number
    username: string
    avatar?: string
  }
  /** 上一篇文章 */
  prev?: {
    id: number
    title: string
  }
  /** 下一篇文章 */
  next?: {
    id: number
    title: string
  }
  /** 是否已点赞 */
  isLiked?: boolean
  /** 文章专属音乐分享信息 */
  music?: ArticleMusic | null
  /** 外部链接列表 */
  references?: Array<{
    title: string
    url: string
  }>
}

/**
 * 分享文章信息
 */
export interface ShareArticle {
  /** 分享 UUID */
  uuid: string
  /** 文章信息 */
  article: ArticleDetail
}

/**
 * 文章列表查询参数
 */
export interface ArticleListParams {
  /** 页码（从 1 开始） */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 分类 ID */
  categoryId?: number
  /** 分类名称 */
  categoryName?: string
  /** 标签名称 */
  tagName?: string
  /** 搜索关键词 */
  keyword?: string
  /** 排序字段 */
  orderBy?: 'createdAt' | 'viewCount' | 'likeCount'
  /** 排序方向 */
  order?: 'ASC' | 'DESC'
}

/**
 * 文章列表响应
 */
export interface ArticleListResponse {
  /** 文章列表 */
  list: ArticleListItem[]
  /** 总数 */
  total: number
  /** 当前页 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  totalPages: number
}

/**
 * 文章详情查询参数
 */
export interface ArticleDetailParams {
  /** 文章 ID */
  id?: number
  /** 文章 Slug */
  slug?: string
  /** 语言参数 */
  locale?: string
}

/**
 * 点赞文章参数
 */
export interface LikeArticleParams {
  /** 文章 ID */
  id: number
}

/**
 * 点赞文章响应
 */
export interface LikeArticleResponse {
  /** 是否成功 */
  success: boolean
  /** 点赞数 */
  likeCount: number
  /** 是否已点赞 */
  isLiked: boolean
}

/**
 * 文章目录项
 */
export interface TocItem {
  /** 标题层级（1-6） */
  level: number
  /** 标题文本 */
  text: string
  /** 锚点 ID */
  anchor: string
  /** 子目录 */
  children?: TocItem[]
}

/**
 * 归档年份信息
 */
export interface ArchiveYear {
  /** 年份 */
  year: number
  /** 文章数量 */
  count: number
  /** 月份列表 */
  months: ArchiveMonth[]
}

/**
 * 归档月份信息
 */
export interface ArchiveMonth {
  /** 月份 */
  month: number
  /** 文章数量 */
  count: number
  /** 文章列表 */
  articles: ArticleListItem[]
}

/**
 * 归档数据
 */
export interface ArchiveData {
  /** 年份列表 */
  years: ArchiveYear[]
  /** 总文章数 */
  total: number
}
