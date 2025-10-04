/**
 * 全局应用状态管理 Store
 * 管理应用级别的状态，如侧边栏、通知、全局配置等
 */

import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

/**
 * 通知消息接口
 */
export interface AppNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
}

/**
 * 应用配置接口
 */
export interface AppConfig {
  /** 博客标题 */
  blogTitle: string
  /** 博客副标题 */
  blogSubtitle: string
  /** 博客描述 */
  blogDescription: string
  /** ICP 备案号 */
  icp?: string
  /** 页脚信息 */
  footer?: string
}

/**
 * 应用状态接口
 */
interface AppState {
  /** 侧边栏是否折叠（移动端） */
  sidebarCollapsed: boolean

  /** 是否显示回到顶部按钮 */
  showBackTop: boolean

  /** 是否显示加载遮罩 */
  globalLoading: boolean

  /** 通知列表 */
  notifications: AppNotification[]

  /** 应用配置 */
  config: AppConfig | null

  /** 是否首次访问（用于显示欢迎页） */
  isFirstVisit: boolean
}

/**
 * 应用操作接口
 */
interface AppActions {
  // ==================== 侧边栏 ====================
  /** 设置侧边栏折叠状态 */
  setSidebarCollapsed: (collapsed: boolean) => void

  /** 切换侧边栏折叠状态 */
  toggleSidebar: () => void

  // ==================== 回到顶部 ====================
  /** 设置回到顶部按钮显示状态 */
  setShowBackTop: (show: boolean) => void

  // ==================== 全局加载 ====================
  /** 设置全局加载状态 */
  setGlobalLoading: (loading: boolean) => void

  // ==================== 通知管理 ====================
  /** 添加通知 */
  addNotification: (notification: Omit<AppNotification, 'id'>) => void

  /** 移除通知 */
  removeNotification: (id: string) => void

  /** 清除所有通知 */
  clearNotifications: () => void

  // ==================== 应用配置 ====================
  /** 设置应用配置 */
  setConfig: (config: AppConfig) => void

  // ==================== 首次访问 ====================
  /** 设置首次访问标记 */
  setFirstVisit: (isFirst: boolean) => void

  // ==================== 重置 ====================
  /** 重置应用状态 */
  reset: () => void
}

/**
 * 初始状态
 */
const initialState: AppState = {
  sidebarCollapsed: false,
  showBackTop: false,
  globalLoading: false,
  notifications: [],
  config: null,
  isFirstVisit: true,
}

/**
 * 创建 AppStore
 */
export const useAppStore = create<AppState & AppActions>()(
  devtools(
    persist(
      immer((set) => ({
        // ==================== 状态 ====================
        ...initialState,

        // ==================== 侧边栏 ====================
        setSidebarCollapsed: (collapsed) =>
          set((state) => {
            state.sidebarCollapsed = collapsed
          }),

        toggleSidebar: () =>
          set((state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed
          }),

        // ==================== 回到顶部 ====================
        setShowBackTop: (show) =>
          set((state) => {
            state.showBackTop = show
          }),

        // ==================== 全局加载 ====================
        setGlobalLoading: (loading) =>
          set((state) => {
            state.globalLoading = loading
          }),

        // ==================== 通知管理 ====================
        addNotification: (notification) =>
          set((state) => {
            const id = `notification-${Date.now()}-${Math.random()}`
            state.notifications.push({
              ...notification,
              id,
            })
          }),

        removeNotification: (id) =>
          set((state) => {
            state.notifications = state.notifications.filter((n) => n.id !== id)
          }),

        clearNotifications: () =>
          set((state) => {
            state.notifications = []
          }),

        // ==================== 应用配置 ====================
        setConfig: (config) =>
          set((state) => {
            state.config = config
          }),

        // ==================== 首次访问 ====================
        setFirstVisit: (isFirst) =>
          set((state) => {
            state.isFirstVisit = isFirst
          }),

        // ==================== 重置 ====================
        reset: () =>
          set((state) => {
            Object.assign(state, initialState)
          }),
      })),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => localStorage),
        // 持久化部分状态
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          isFirstVisit: state.isFirstVisit,
        }),
      }
    ),
    {
      name: 'AppStore',
    }
  )
)

/**
 * 导出默认实例
 */
export default useAppStore