/**
 * 设计令牌 - 颜色系统
 * 基于原有的萌系风格，定义完整的颜色体系
 */

export const colors = {
  // 主色调
  primary: {
    50: '#fff0f6',
    100: '#ffe0ed',
    200: '#ffc1dc',
    300: '#ffa1ca',
    400: '#ff82b9',
    500: '#ff69b4', // 主色 - 粉色
    600: '#e65aa3',
    700: '#cc4b92',
    800: '#b33c81',
    900: '#992d70',
  },

  // 辅助色
  secondary: {
    50: '#e0f7ff',
    100: '#b3ebff',
    200: '#80dfff',
    300: '#4dd3ff',
    400: '#1ac7ff',
    500: '#87ceeb', // 辅助色 - 天蓝色
    600: '#6bb8d9',
    700: '#4fa2c7',
    800: '#338cb5',
    900: '#1776a3',
  },

  // 成功色
  success: {
    50: '#f0fff4',
    100: '#c6f6d5',
    200: '#9ae6b4',
    300: '#68d391',
    400: '#48bb78',
    500: '#98fb98', // 主成功色
    600: '#38a169',
    700: '#2f855a',
    800: '#276749',
    900: '#22543d',
  },

  // 警告色
  warning: {
    50: '#fffaf0',
    100: '#feebc8',
    200: '#fbd38d',
    300: '#f6ad55',
    400: '#ed8936',
    500: '#ffa500', // 主警告色
    600: '#dd6b20',
    700: '#c05621',
    800: '#9c4221',
    900: '#7b341e',
  },

  // 错误色
  error: {
    50: '#fff5f5',
    100: '#fed7d7',
    200: '#feb2b2',
    300: '#fc8181',
    400: '#f56565',
    500: '#ff6b6b', // 主错误色
    600: '#e53e3e',
    700: '#c53030',
    800: '#9b2c2c',
    900: '#742a2a',
  },

  // 信息色
  info: {
    50: '#ebf8ff',
    100: '#bee3f8',
    200: '#90cdf4',
    300: '#63b3ed',
    400: '#4299e1',
    500: '#3182ce',
    600: '#2b6cb0',
    700: '#2c5282',
    800: '#2a4365',
    900: '#1a365d',
  },

  // 中性色（明亮主题）
  neutral: {
    50: '#f7fafc',
    100: '#edf2f7',
    200: '#e2e8f0',
    300: '#cbd5e0',
    400: '#a0aec0',
    500: '#718096',
    600: '#4a5568',
    700: '#2d3748',
    800: '#1a202c',
    900: '#171923',
  },

  // 文本颜色
  text: {
    primary: '#2d3748',
    secondary: '#718096',
    tertiary: '#a0aec0',
    disabled: '#cbd5e0',
    inverse: '#ffffff',
  },

  // 背景颜色
  background: {
    primary: '#ffffff',
    secondary: '#f7fafc',
    tertiary: '#edf2f7',
    hover: '#e2e8f0',
    pressed: '#cbd5e0',
    disabled: '#f7fafc',
  },

  // 边框颜色
  border: {
    default: '#e2e8f0',
    hover: '#cbd5e0',
    focus: '#ff69b4',
    error: '#ff6b6b',
    disabled: '#edf2f7',
  },

  // 毛玻璃效果
  glass: {
    background: 'rgba(255, 255, 255, 0.8)',
    backgroundDark: 'rgba(26, 32, 44, 0.8)',
    border: 'rgba(255, 255, 255, 0.18)',
    borderDark: 'rgba(255, 255, 255, 0.12)',
  },

  // 渐变色
  gradients: {
    primary: 'linear-gradient(135deg, #ff69b4 0%, #ffb3d9 100%)',
    secondary: 'linear-gradient(135deg, #87ceeb 0%, #b3ebff 100%)',
    success: 'linear-gradient(135deg, #98fb98 0%, #c6f6d5 100%)',
    rainbow: 'linear-gradient(90deg, #ff69b4, #87ceeb, #98fb98, #ffa500)',
    sunset: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 50%, #ff69b4 100%)',
  },

  // 暗色主题
  dark: {
    background: {
      primary: '#1a202c',
      secondary: '#2d3748',
      tertiary: '#4a5568',
    },
    text: {
      primary: '#f7fafc',
      secondary: '#cbd5e0',
      tertiary: '#a0aec0',
    },
    border: {
      default: '#4a5568',
      hover: '#718096',
    },
  },

  // 特殊颜色
  special: {
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    overlayDark: 'rgba(0, 0, 0, 0.7)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowMedium: 'rgba(0, 0, 0, 0.15)',
    shadowHeavy: 'rgba(0, 0, 0, 0.25)',
    glow: 'rgba(255, 105, 180, 0.5)',
  },
} as const

export type ColorToken = typeof colors