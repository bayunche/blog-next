/**
 * Token 管理工具
 * 处理用户认证 Token 的存储和获取
 */

import { get, save, remove } from './storage'

const TOKEN_KEY = 'userInfo'

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
  // 其他用户信息字段...
}

/**
 * 获取用户 Token
 * @returns Token 字符串，如果不存在返回空字符串
 */
export const getToken = (): string => {
  const userInfo = get<UserInfo>(TOKEN_KEY)

  if (userInfo && userInfo.token) {
    return `Bearer ${userInfo.token}`
  }

  return ''
}

/**
 * 获取原始 Token (不带 Bearer 前缀)
 * @returns Token 字符串，如果不存在返回空字符串
 */
export const getRawToken = (): string => {
  const userInfo = get<UserInfo>(TOKEN_KEY)
  return userInfo?.token || ''
}

/**
 * 保存用户信息和 Token
 * @param userInfo 用户信息对象
 */
export const saveUserInfo = (userInfo: UserInfo): void => {
  save(TOKEN_KEY, userInfo)
}

/**
 * 获取用户信息
 * @returns 用户信息对象，如果不存在返回 null
 */
export const getUserInfo = (): UserInfo | null => {
  return get<UserInfo>(TOKEN_KEY)
}

/**
 * 更新用户信息（合并更新）
 * @param updates 要更新的字段
 */
export const updateUserInfo = (updates: Partial<UserInfo>): void => {
  const currentInfo = getUserInfo()
  if (currentInfo) {
    saveUserInfo({ ...currentInfo, ...updates })
  }
}

/**
 * 移除用户信息和 Token（登出）
 */
export const removeToken = (): void => {
  remove(TOKEN_KEY)
}

/**
 * 检查用户是否已登录
 * @returns 是否已登录
 */
export const isLoggedIn = (): boolean => {
  const token = getRawToken()
  return !!token
}

/**
 * 检查用户是否是管理员
 * @returns 是否是管理员
 */
export const isAdmin = (): boolean => {
  const userInfo = getUserInfo()
  return userInfo?.role === 1
}