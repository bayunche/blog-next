/**
 * Zustand Stores 统一导出
 */

// ==================== 导入初始化函数 ====================
import { initializeTheme } from './themeStore'

// ==================== 类型定义 ====================
export type { StoreState, StoreActions, User } from './types'

// ==================== Auth Store ====================
export { useAuthStore } from './authStore'
export type { default as AuthStore } from './authStore'

// ==================== Theme Store ====================
export { useThemeStore, initializeTheme, type ThemeMode } from './themeStore'
export type { default as ThemeStore } from './themeStore'

// ==================== App Store ====================
export { useAppStore, type AppNotification, type AppConfig } from './appStore'
export type { default as AppStore } from './appStore'

/**
 * 初始化所有 Store
 * 在应用启动时调用
 */
export const initializeStores = () => {
  // 直接调用初始化函数
  initializeTheme()
}