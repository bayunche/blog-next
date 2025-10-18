/**
 * Token 管理工具
 * 从 Zustand Store 获取认证信息，以其为唯一数据源
 */
import { useAuthStore } from '@stores/authStore'

export interface UserInfo {
  token: string
  userId?: number
  username?: string
  email?: string
  avatar?: string
  role?: number
  github?: string
  notice?: boolean
  disabledDiscuss?: boolean
}

/**
 * 获取用户 Token (带 Bearer 前缀)
 * @returns Token 字符串，如果不存在返回空字符串
 */
export const getToken = (): string => {
  const { token } = useAuthStore.getState()
  return token ? `Bearer ${token}` : ''
}

/**
 * 获取原始 Token (不带 Bearer 前缀)
 * @returns Token 字符串，如果不存在返回空字符串
 */
export const getRawToken = (): string => {
  const { token } = useAuthStore.getState()
  return token || ''
}

/**
 * 获取用户信息
 * @returns 用户信息对象，如果不存在返回 null
 */
export const getUserInfo = (): UserInfo | null => {
  const { user } = useAuthStore.getState()
  return user as UserInfo | null
}

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export const isLoggedIn = (): boolean => {
  const { token } = useAuthStore.getState()
  return !!token
}

/**
 * 检查用户是否是管理员
 * @returns 是否是管理员
 */
export const isAdmin = (): boolean => {
  const { user } = useAuthStore.getState()
  return user?.role === 1
}