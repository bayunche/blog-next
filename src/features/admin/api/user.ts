/**
 * 用户管理 API
 */

import request from '@shared/api/axios'

/**
 * 用户列表参数
 */
export interface UserListParams {
  page?: number
  pageSize?: number
  keyword?: string
  role?: 'user' | 'admin'
}

/**
 * 用户列表项
 */
export interface UserItem {
  id: number
  username: string
  email?: string
  avatar?: string
  role: 'user' | 'admin'
  notice?: boolean
  disabledDiscuss?: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 用户列表响应
 */
export interface UserListResponse {
  list: UserItem[]
  total: number
  page: number
  pageSize: number
}

/**
 * 更新用户参数
 */
export interface UpdateUserParams {
  role?: 'user' | 'admin'
  notice?: boolean
  disabledDiscuss?: boolean
}

/**
 * 获取用户列表
 */
export const getUserListAPI = (params?: UserListParams): Promise<UserListResponse> => {
  return request.get('/admin/user/list', { params })
}

/**
 * 获取用户详情
 */
export const getUserDetailAPI = (id: number): Promise<UserItem> => {
  return request.get(`/admin/user/${id}`)
}

/**
 * 更新用户
 */
export const updateUserAPI = (id: number, data: UpdateUserParams): Promise<UserItem> => {
  return request.put(`/admin/user/${id}`, data)
}

/**
 * 删除用户
 */
export const deleteUserAPI = (id: number): Promise<void> => {
  return request.delete(`/admin/user/${id}`)
}
