/**
 * 主题状态管理 Store
 * 管理应用的主题模式（明亮/暗黑/自动）
 */

import { create } from 'zustand'
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

/**
 * 主题模式类型
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 主题状态接口
 */
interface ThemeState {
  /** 主题模式 */
  mode: ThemeMode
  /** 实际使用的主题（当 mode 为 auto 时，根据系统主题计算） */
  actualTheme: 'light' | 'dark'
}

/**
 * 主题操作接口
 */
interface ThemeActions {
  /** 设置主题模式 */
  setMode: (mode: ThemeMode) => void

  /** 设置实际主题 */
  setActualTheme: (theme: 'light' | 'dark') => void

  /** 切换主题（在 light 和 dark 之间切换） */
  toggleTheme: () => void

  /** 重置到默认主题 */
  reset: () => void
}

/**
 * 检测系统主题
 */
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

/**
 * 初始状态
 */
const initialState: ThemeState = {
  mode: 'auto',
  actualTheme: getSystemTheme(),
}

/**
 * 创建 ThemeStore
 */
export const useThemeStore = create<ThemeState & ThemeActions>()(
  devtools(
    persist(
      (set, get) => ({
        // ==================== 状态 ====================
        ...initialState,

        // ==================== 操作 ====================
        setMode: (mode) => {
          set({ mode })

          // 如果是 auto 模式，根据系统主题设置实际主题
          if (mode === 'auto') {
            const systemTheme = getSystemTheme()
            set({ actualTheme: systemTheme })
          } else {
            set({ actualTheme: mode })
          }

          // 更新 HTML data 属性
          if (typeof document !== 'undefined') {
            const actualTheme = mode === 'auto' ? getSystemTheme() : mode
            document.documentElement.setAttribute('data-theme', actualTheme)
          }
        },

        setActualTheme: (theme) => {
          set({ actualTheme: theme })

          // 更新 HTML data 属性
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme)
          }
        },

        toggleTheme: () => {
          const { actualTheme } = get()
          const newTheme = actualTheme === 'light' ? 'dark' : 'light'

          set({
            mode: newTheme,
            actualTheme: newTheme,
          })

          // 更新 HTML data 属性
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newTheme)
          }
        },

        reset: () => {
          set(initialState)

          // 更新 HTML data 属性
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', initialState.actualTheme)
          }
        },
      }),
      {
        name: 'theme-storage',
        storage: createJSONStorage(() => localStorage),
        // 只持久化 mode
        partialize: (state) => ({
          mode: state.mode,
        }),
      }
    ),
    {
      name: 'ThemeStore',
    }
  )
)

/**
 * 初始化主题
 * 在应用启动时调用，应用保存的主题设置
 */
export const initializeTheme = () => {
  const { mode, setMode } = useThemeStore.getState()

  // 监听系统主题变化
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      const { mode, setActualTheme } = useThemeStore.getState()

      if (mode === 'auto') {
        setActualTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
  }

  // 应用当前主题
  setMode(mode)
}

/**
 * 导出默认实例
 */
export default useThemeStore