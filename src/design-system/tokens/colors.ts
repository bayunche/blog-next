/**
 * 设计令牌 - 颜色系统
 * 基于 diygod.cc 的暖橙色风格，定义完整的颜色体系
 */

export const colors = {
  // 主色调（暖橙色系 - diygod.cc 风格）
  primary: {
    50: '#fef5ed',
    100: '#fde8d5',
    200: '#fbd1ab',
    300: '#f9ba81',
    400: '#e89a5e',
    500: '#d67f47', // 主色 - 暖橙色
    600: '#c46d3a',
    700: '#a35730',
    800: '#824527',
    900: '#6b3921',
  },

  // 辅助色（保持柔和的配色）
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#87ceeb', // 辅助色 - 天蓝色
    600: '#6bb8d9',
    700: '#4fa2c7',
    800: '#338cb5',
    900: '#1776a3',
  },

  // 成功色
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // 主成功色
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // 警告色（与主色协调的橙色）
  warning: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316', // 主警告色
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },

  // 错误色
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // 主错误色
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // 信息色
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // 中性色（米白/米黄色系 - diygod.cc 风格）
  neutral: {
    50: '#faf8f5',
    100: '#f5f3f0',
    200: '#ece6e3',
    300: '#d6cbc5',
    400: '#b8aca5',
    500: '#93857d',
    600: '#6f6560',
    700: '#544d49',
    800: '#3a3532',
    900: '#2c2826',
  },

  // 文本颜色（diygod.cc 风格）
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    tertiary: '#95a5a6',
    disabled: '#cbd5e0',
    inverse: '#ffffff',
  },

  // 背景颜色（米白/米黄系统）
  background: {
    primary: '#faf8f5', // 主背景 - 米白色
    secondary: '#ffffff', // 卡片背景 - 纯白
    tertiary: '#f5f3f0', // 第三层背景
    hover: '#ece6e3', // 悬浮背景
    pressed: '#d6cbc5',
    disabled: '#f5f3f0',
  },

  // 边框颜色
  border: {
    default: '#e8e8e8',
    hover: '#d6cbc5',
    focus: '#d67f47',
    error: '#ef4444',
    disabled: '#f0f0f0',
  },

  // 毛玻璃效果
  glass: {
    background: 'rgba(255, 255, 255, 0.8)',
    backgroundDark: 'rgba(22, 20, 19, 0.8)',
    border: 'rgba(255, 255, 255, 0.18)',
    borderDark: 'rgba(255, 255, 255, 0.12)',
  },

  // 渐变色（暖色系）
  gradients: {
    primary: 'linear-gradient(135deg, #d67f47 0%, #e8a378 100%)',
    secondary: 'linear-gradient(135deg, #87ceeb 0%, #b3ebff 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #86efac 100%)',
    warm: 'linear-gradient(135deg, #d67f47, #f97316, #ea580c)',
    sunset: 'linear-gradient(135deg, #ef4444 0%, #f97316 50%, #d67f47 100%)',
  },

  // 暗色主题（diygod.cc 深色模式）
  dark: {
    background: {
      primary: '#161413', // 主背景 - 深炭灰
      secondary: '#1f1d1c', // 卡片背景
      tertiary: '#2a2624', // 第三层背景
    },
    text: {
      primary: '#e8e8e8',
      secondary: '#a8a8a8',
      tertiary: '#888888',
    },
    border: {
      default: '#3a3a3a',
      hover: '#505050',
    },
  },

  // 特殊颜色
  special: {
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    overlayDark: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.06)',
    shadowMedium: 'rgba(0, 0, 0, 0.08)',
    shadowHeavy: 'rgba(0, 0, 0, 0.1)',
    glow: 'rgba(214, 127, 71, 0.5)', // 暖橙色光晕
  },
} as const

export type ColorToken = typeof colors
