/**
 * 评论模块 API
 */

import request from '@shared/api/axios'
import type {
  GetCommentsParams,
  CommentListResponse,
  CreateCommentParams,
  CreateReplyParams,
  DeleteCommentParams,
  DeleteReplyParams,
  CreateCommentResponse,
  DeleteCommentResponse,
} from '../types'

/**
 * 获取评论列表
 */
export const getCommentsAPI = (
  params: GetCommentsParams
): Promise<CommentListResponse> => {
  return request.get('/discuss', { params })
}

/**
 * 创建评论
 */
export const createCommentAPI = (
  data: CreateCommentParams
): Promise<CreateCommentResponse> => {
  return request.post('/discuss', {
    articleId: data.articleId,
    content: data.content,
  })
}

/**
 * 创建回复
 */
export const createReplyAPI = (
  data: CreateReplyParams
): Promise<CreateCommentResponse> => {
  return request.post('/discuss', {
    commentId: data.commentId,
    content: data.content,
    toUserId: data.toUserId,
  })
}

/**
 * 删除评论
 */
export const deleteCommentAPI = (
  params: DeleteCommentParams
): Promise<DeleteCommentResponse> => {
  return request.delete(`/discuss/comment/${params.id}`)
}

/**
 * 删除回复
 */
export const deleteReplyAPI = (
  params: DeleteReplyParams
): Promise<DeleteCommentResponse> => {
  return request.delete(`/discuss/reply/${params.id}`)
}
