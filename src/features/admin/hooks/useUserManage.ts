/**
 * 用户管理 Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import {
  getUserListAPI,
  getUserDetailAPI,
  updateUserAPI,
  deleteUserAPI,
  type UserListParams,
  type UpdateUserParams,
} from '../api/user'

/**
 * 获取用户列表 Hook
 */
export function useUserList(params?: UserListParams) {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => getUserListAPI(params),
    staleTime: 1000 * 60 * 2, // 2分钟
  })
}

/**
 * 获取用户详情 Hook
 */
export function useUserDetail(id: number) {
  return useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => getUserDetailAPI(id),
    enabled: !!id && id > 0,
  })
}

/**
 * 更新用户 Hook
 */
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserParams }) =>
      updateUserAPI(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-user', variables.id] })
      message.success('更新成功')
    },
    onError: (error: Error) => {
      message.error(error.message || '更新失败')
    },
  })
}

/**
 * 删除用户 Hook
 */
export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteUserAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      message.success('删除成功')
    },
    onError: (error: Error) => {
      message.error(error.message || '删除失败')
    },
  })
}
