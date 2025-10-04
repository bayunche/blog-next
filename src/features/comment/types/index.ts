/**
 * 评论模块类型定义
 */

/**
 * 评论用户信息
 */
export interface CommentUser {
  /** 用户 ID */
  id: number
  /** 用户名 */
  username: string
  /** 头像 */
  avatar?: string
  /** 角色（1: 管理员，2: 普通用户） */
  role?: number
}

/**
 * 回复信息
 */
export interface Reply {
  /** 回复 ID */
  id: number
  /** 回复内容 */
  content: string
  /** 回复用户 */
  user: CommentUser
  /** 被回复用户 */
  toUser?: CommentUser
  /** 创建时间 */
  createdAt: string
  /** 是否可删除（当前用户是否有权限删除） */
  canDelete?: boolean
}

/**
 * 评论信息
 */
export interface Comment {
  /** 评论 ID */
  id: number
  /** 评论内容 */
  content: string
  /** 评论用户 */
  user: CommentUser
  /** 回复列表 */
  replies: Reply[]
  /** 创建时间 */
  createdAt: string
  /** 是否可删除（当前用户是否有权限删除） */
  canDelete?: boolean
}

/**
 * 评论列表响应
 */
export interface CommentListResponse {
  /** 评论列表 */
  list: Comment[]
  /** 总数 */
  total: number
}

/**
 * 获取评论列表参数
 */
export interface GetCommentsParams {
  /** 文章 ID */
  articleId: number
  /** 页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 创建评论参数
 */
export interface CreateCommentParams {
  /** 文章 ID */
  articleId: number
  /** 评论内容 */
  content: string
}

/**
 * 创建回复参数
 */
export interface CreateReplyParams {
  /** 评论 ID */
  commentId: number
  /** 回复内容 */
  content: string
  /** 被回复用户 ID（可选） */
  toUserId?: number
}

/**
 * 删除评论参数
 */
export interface DeleteCommentParams {
  /** 评论 ID */
  id: number
}

/**
 * 删除回复参数
 */
export interface DeleteReplyParams {
  /** 回复 ID */
  id: number
}

/**
 * 创建评论/回复响应
 */
export interface CreateCommentResponse {
  /** 是否成功 */
  success: boolean
  /** 新创建的评论/回复 */
  data: Comment | Reply
}

/**
 * 删除评论/回复响应
 */
export interface DeleteCommentResponse {
  /** 是否成功 */
  success: boolean
  /** 提示消息 */
  message?: string
}
