/**
 * 设计令牌 - 间距系统
 * 基于 8px 基准单位的间距体系
 */

export const spacing = {
  // 基础间距（8px 体系）
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
  40: '10rem', // 160px
  48: '12rem', // 192px
  56: '14rem', // 224px
  64: '16rem', // 256px

  // 语义化间距
  semantic: {
    // 组件内部间距
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px

    // 布局间距
    gutter: '1rem', // 16px - 栅格间距
    section: '3rem', // 48px - 区块间距
    page: '4rem', // 64px - 页面边距

    // 组件特定间距
    cardPadding: '1.5rem', // 24px
    modalPadding: '1.5rem', // 24px
    formItemGap: '1.5rem', // 24px
    buttonPadding: '0.5rem 1rem', // 8px 16px
    inputPadding: '0.5rem 0.75rem', // 8px 12px
  },

  // 容器宽度
  container: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%',
  },

  // 响应式断点
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const

export type SpacingToken = typeof spacing