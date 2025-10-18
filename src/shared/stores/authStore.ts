/**
 * 认证状态管理 Store
 * 管理用户登录、登出、Token 等认证相关状态
 */

import { create } from 'zustand'
import { persist, createJSONStorage, devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { User } from './types'

/**
 * 认证状态接口
 */
interface AuthState {
  /** 当前用户信息 */
  user: User | null
  /** 认证 Token */
  token: string | null
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
}

/**
 * 认证操作接口
 */
interface AuthActions {
  // ==================== 同步操作 ====================
  /** 设置用户信息 */
  setUser: (user: User | null) => void

  /** 设置 Token */
  setToken: (token: string | null) => void

  /** 设置加载状态 */
  setLoading: (loading: boolean) => void

  /** 设置错误信息 */
  setError: (error: string | null) => void

  /** 设置用户信息和 Token */
  setAuth: (user: User, token: string) => void

  // ==================== 异步操作 ====================
  /** 登出 */
  logout: () => void

  /** 重置状态 */
  reset: () => void

  // ==================== 计算属性 ====================
  /** 是否已认证 */
  isAuthenticated: () => boolean

  /** 是否是管理员 */
  isAdmin: () => boolean
}

/**
 * 初始状态
 */
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

/**
 * 创建 AuthStore
 * 使用 Zustand 的多个 middleware：
 * - devtools: Redux DevTools 支持
 * - persist: 持久化到 localStorage
 * - subscribeWithSelector: 支持细粒度订阅
 * - immer: 使用 immer 简化不可变更新
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, get) => ({
          // ==================== 状态 ====================
          ...initialState,

          // ==================== 同步操作 ====================
          setUser: (user) =>
            set((state) => {
              state.user = user
            }),

          setToken: (token) =>
            set((state) => {
              state.token = token
            }),

          setLoading: (loading) =>
            set((state) => {
              state.loading = loading
            }),

          setError: (error) =>
            set((state) => {
              state.error = error
            }),

          setAuth: (user, token) =>
            set((state) => {
              state.user = user
              state.token = token
              state.error = null
            }),

          // ==================== 异步操作 ====================
          logout: () => {
            // 清除状态，persist middleware 会自动同步到 localStorage
            set(initialState)
          },

          reset: () => set(initialState),

          // ==================== 计算属性 ====================
          isAuthenticated: () => {
            const { token } = get()
            return !!token
          },

          isAdmin: () => {
            const { user } = get()
            return user?.role === 1
          },
        }))
      ),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
        // 只持久化 user 和 token
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
      }
    ),
    {
      name: 'AuthStore',
    }
  )
)

/**
 * 导出默认实例
 */
export default useAuthStore