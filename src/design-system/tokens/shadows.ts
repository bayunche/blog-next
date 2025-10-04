/**
 * 设计令牌 - 阴影系统
 * 定义多层次的阴影效果
 */

export const shadows = {
  // 基础阴影
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 6px 12px -2px rgba(0, 0, 0, 0.12), 0 3px 7px -3px rgba(0, 0, 0, 0.08)',
  lg: '0 10px 20px -3px rgba(0, 0, 0, 0.15), 0 4px 10px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.18), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

  // 毛玻璃阴影
  glass: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1), 0 0 1px rgba(255, 255, 255, 0.5) inset',
    md: '0 4px 16px rgba(0, 0, 0, 0.12), 0 0 2px rgba(255, 255, 255, 0.5) inset',
    lg: '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 3px rgba(255, 255, 255, 0.5) inset',
  },

  // 彩色阴影（主题色）
  colored: {
    primary: {
      sm: '0 2px 8px rgba(255, 105, 180, 0.25)',
      md: '0 4px 16px rgba(255, 105, 180, 0.3)',
      lg: '0 8px 32px rgba(255, 105, 180, 0.35)',
    },
    secondary: {
      sm: '0 2px 8px rgba(135, 206, 235, 0.25)',
      md: '0 4px 16px rgba(135, 206, 235, 0.3)',
      lg: '0 8px 32px rgba(135, 206, 235, 0.35)',
    },
    success: {
      sm: '0 2px 8px rgba(152, 251, 152, 0.25)',
      md: '0 4px 16px rgba(152, 251, 152, 0.3)',
      lg: '0 8px 32px rgba(152, 251, 152, 0.35)',
    },
    warning: {
      sm: '0 2px 8px rgba(255, 165, 0, 0.25)',
      md: '0 4px 16px rgba(255, 165, 0, 0.3)',
      lg: '0 8px 32px rgba(255, 165, 0, 0.35)',
    },
    error: {
      sm: '0 2px 8px rgba(255, 107, 107, 0.25)',
      md: '0 4px 16px rgba(255, 107, 107, 0.3)',
      lg: '0 8px 32px rgba(255, 107, 107, 0.35)',
    },
  },

  // 发光效果
  glow: {
    primary: '0 0 20px rgba(255, 105, 180, 0.5)',
    secondary: '0 0 20px rgba(135, 206, 235, 0.5)',
    success: '0 0 20px rgba(152, 251, 152, 0.5)',
    warning: '0 0 20px rgba(255, 165, 0, 0.5)',
    error: '0 0 20px rgba(255, 107, 107, 0.5)',
  },

  // 悬浮效果（hover）
  hover: {
    sm: '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
    md: '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
    lg: '0 12px 24px rgba(0, 0, 0, 0.18), 0 6px 12px rgba(0, 0, 0, 0.12)',
  },

  // 聚焦效果（focus）
  focus: {
    primary: '0 0 0 3px rgba(255, 105, 180, 0.3)',
    secondary: '0 0 0 3px rgba(135, 206, 235, 0.3)',
    success: '0 0 0 3px rgba(152, 251, 152, 0.3)',
    warning: '0 0 0 3px rgba(255, 165, 0, 0.3)',
    error: '0 0 0 3px rgba(255, 107, 107, 0.3)',
  },

  // 禁用状态
  disabled: '0 1px 3px rgba(0, 0, 0, 0.05)',

  // 模态框阴影
  modal: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
  modalBackdrop: '0 0 0 9999px rgba(0, 0, 0, 0.5)',

  // 下拉菜单阴影
  dropdown: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 5px 10px -5px rgba(0, 0, 0, 0.08)',

  // 卡片阴影
  card: {
    rest: '0 2px 8px rgba(0, 0, 0, 0.08)',
    hover: '0 8px 20px rgba(0, 0, 0, 0.12), 0 4px 10px rgba(0, 0, 0, 0.08)',
    pressed: '0 1px 3px rgba(0, 0, 0, 0.12)',
  },

  // 浮动按钮阴影
  fab: {
    rest: '0 6px 16px rgba(0, 0, 0, 0.15)',
    hover: '0 8px 20px rgba(0, 0, 0, 0.2)',
    pressed: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
} as const

export type ShadowToken = typeof shadows