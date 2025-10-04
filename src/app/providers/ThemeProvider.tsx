/**
 * 主题 Provider
 * 管理应用的主题状态，包括明暗模式切换
 */

import { ConfigProvider, App as AntApp, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { useEffect, useState, type ReactNode } from 'react'
import { getThemeConfig } from '@design-system/themes/antd-theme'

// 主题类型
export type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeProviderProps {
  children: ReactNode
}

// 从 localStorage 获取主题设置
const getInitialTheme = (): ThemeMode => {
  const stored = localStorage.getItem('theme-mode')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }
  return 'auto'
}

// 检测系统主题
const getSystemTheme = (): 'light' | 'dark' => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme)
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() => {
    const initial = getInitialTheme()
    return initial === 'auto' ? getSystemTheme() : initial
  })

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      if (themeMode === 'auto') {
        setActualTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  // 主题模式改变时更新实际主题
  useEffect(() => {
    if (themeMode === 'auto') {
      setActualTheme(getSystemTheme())
    } else {
      setActualTheme(themeMode)
    }

    // 保存到 localStorage
    localStorage.setItem('theme-mode', themeMode)

    // 更新 HTML data 属性，用于 CSS 变量
    document.documentElement.setAttribute('data-theme', actualTheme)
  }, [themeMode, actualTheme])

  // 获取 Ant Design 主题配置
  const antdTheme = getThemeConfig(actualTheme === 'dark')

  // 提供主题切换方法（通过 Context API 或全局状态管理）
  useEffect(() => {
    // 将主题切换方法暴露到全局，方便其他组件使用
    ;(window as any).__setTheme = setThemeMode
    ;(window as any).__getTheme = () => themeMode
    ;(window as any).__getActualTheme = () => actualTheme
  }, [themeMode, actualTheme])

  return (
    <ConfigProvider
      theme={{
        ...antdTheme,
        algorithm: actualTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
      locale={zhCN}
    >
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  )
}

// 导出主题切换 Hook（可选，也可以使用全局状态管理）
export function useTheme() {
  const setTheme = (mode: ThemeMode) => {
    ;(window as any).__setTheme?.(mode)
  }

  const getTheme = (): ThemeMode => {
    return (window as any).__getTheme?.() || 'auto'
  }

  const getActualTheme = (): 'light' | 'dark' => {
    return (window as any).__getActualTheme?.() || 'light'
  }

  return {
    setTheme,
    getTheme,
    getActualTheme,
  }
}