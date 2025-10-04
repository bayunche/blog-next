/**
 * Store 类型定义
 * 定义通用的 Store 状态和操作接口
 */

/**
 * 通用 Store 状态接口
 */
export interface StoreState<T> {
  /** 数据 */
  data: T | null
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
}

/**
 * 通用 Store 操作接口
 */
export interface StoreActions<T> {
  /** 设置数据 */
  setData: (data: T) => void
  /** 设置加载状态 */
  setLoading: (loading: boolean) => void
  /** 设置错误信息 */
  setError: (error: string | null) => void
  /** 重置状态 */
  reset: () => void
}

/**
 * 用户信息类型
 */
export interface User {
  /** 用户ID */
  id: number
  /** 用户名 */
  username: string
  /** 邮箱 */
  email?: string
  /** 头像 */
  avatar?: string
  /** 角色（1=管理员，0=普通用户） */
  role: number
  /** GitHub 用户名 */
  github?: string
  /** 是否开启通知 */
  notice?: boolean
  /** 是否禁用评论 */
  disabledDiscuss?: boolean
  /** 创建时间 */
  createdAt?: string
  /** 更新时间 */
  updatedAt?: string
}