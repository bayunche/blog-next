/**
 * 设计令牌 - 字体系统
 * 定义完整的排版体系
 */

export const typography = {
  // 字体家族
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    heading:
      '"Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  },

  // 字号
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px
    '8xl': '6rem', // 96px
    '9xl': '8rem', // 128px
  },

  // 字重
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // 行高
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
  },

  // 字母间距
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // 预设排版样式
  presets: {
    // 标题样式
    h1: {
      fontSize: '2.25rem', // 36px
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '1.875rem', // 30px
      lineHeight: 1.3,
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.5rem', // 24px
      lineHeight: 1.4,
      fontWeight: 600,
      letterSpacing: 'normal',
    },
    h4: {
      fontSize: '1.25rem', // 20px
      lineHeight: 1.5,
      fontWeight: 600,
      letterSpacing: 'normal',
    },
    h5: {
      fontSize: '1.125rem', // 18px
      lineHeight: 1.5,
      fontWeight: 600,
      letterSpacing: 'normal',
    },
    h6: {
      fontSize: '1rem', // 16px
      lineHeight: 1.5,
      fontWeight: 600,
      letterSpacing: 'normal',
    },

    // 正文样式
    body: {
      fontSize: '1rem', // 16px
      lineHeight: 1.6,
      fontWeight: 400,
      letterSpacing: 'normal',
    },
    bodyLarge: {
      fontSize: '1.125rem', // 18px
      lineHeight: 1.6,
      fontWeight: 400,
      letterSpacing: 'normal',
    },
    bodySmall: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
      fontWeight: 400,
      letterSpacing: 'normal',
    },

    // 标签样式
    caption: {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.4,
      fontWeight: 400,
      letterSpacing: 'wide',
    },
    overline: {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.4,
      fontWeight: 600,
      letterSpacing: 'widest',
      textTransform: 'uppercase' as const,
    },

    // 代码样式
    code: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.6,
      fontWeight: 400,
      fontFamily:
        'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    codeBlock: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.7,
      fontWeight: 400,
      fontFamily:
        'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },

    // 链接样式
    link: {
      fontSize: 'inherit',
      lineHeight: 'inherit',
      fontWeight: 400,
      textDecoration: 'underline' as const,
    },

    // 按钮样式
    button: {
      fontSize: '0.875rem', // 14px
      lineHeight: 1.5,
      fontWeight: 500,
      letterSpacing: 'normal',
    },
    buttonLarge: {
      fontSize: '1rem', // 16px
      lineHeight: 1.5,
      fontWeight: 500,
      letterSpacing: 'normal',
    },
    buttonSmall: {
      fontSize: '0.75rem', // 12px
      lineHeight: 1.5,
      fontWeight: 500,
      letterSpacing: 'normal',
    },
  },
} as const

export type TypographyToken = typeof typography