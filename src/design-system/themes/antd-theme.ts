/**
 * Ant Design v5 主题配置
 * 基于设计令牌系统配置
 */

import type { ThemeConfig } from 'antd'
import { colors } from '../tokens'

// 亮色主题配置
export const lightTheme: ThemeConfig = {
  token: {
    // 主色
    colorPrimary: colors.primary[500],
    colorSuccess: colors.success[500],
    colorWarning: colors.warning[500],
    colorError: colors.error[500],
    colorInfo: colors.info[500],

    // 文本颜色
    colorText: colors.text.primary,
    colorTextSecondary: colors.text.secondary,
    colorTextTertiary: colors.text.tertiary,
    colorTextQuaternary: colors.text.disabled,

    // 背景颜色
    colorBgContainer: colors.background.primary,
    colorBgElevated: colors.background.primary,
    colorBgLayout: colors.background.secondary,
    colorBgSpotlight: colors.background.tertiary,

    // 边框
    colorBorder: colors.border.default,
    colorBorderSecondary: colors.border.hover,

    // 圆角
    borderRadius: 8,
    borderRadiusLG: 16,
    borderRadiusSM: 4,
    borderRadiusXS: 2,

    // 字体
    fontSize: 14,
    fontSizeHeading1: 36,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 18,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 18,

    // 行高
    lineHeight: 1.6,
    lineHeightHeading1: 1.2,
    lineHeightHeading2: 1.3,
    lineHeightHeading3: 1.4,
    lineHeightHeading4: 1.5,
    lineHeightHeading5: 1.5,

    // 字重
    fontWeightStrong: 600,

    // 阴影
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.12)',

    // 控件高度
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,

    // 运动
    motionUnit: 0.1,
    motionBase: 0,
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    motionEaseIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',

    // 层级
    zIndexBase: 0,
    zIndexPopupBase: 1000,

    // 线宽
    lineWidth: 1,
    lineWidthBold: 2,

    // 透明度
    opacityLoading: 0.65,

    // 链接
    colorLink: colors.primary[500],
    colorLinkHover: colors.primary[400],
    colorLinkActive: colors.primary[600],

    // 毛玻璃效果
    colorBgMask: 'rgba(0, 0, 0, 0.45)',
  },
  components: {
    // Button 组件
    Button: {
      primaryShadow: '0 2px 8px rgba(255, 105, 180, 0.25)',
      algorithm: true,
    },

    // Card 组件
    Card: {
      boxShadowTertiary: '0 2px 8px rgba(0, 0, 0, 0.08)',
      paddingLG: 24,
      borderRadiusLG: 16,
    },

    // Modal 组件
    Modal: {
      contentBg: colors.background.primary,
      headerBg: colors.background.primary,
      borderRadiusLG: 16,
    },

    // Drawer 组件
    Drawer: {
      footerPaddingBlock: 16,
      footerPaddingInline: 24,
    },

    // Table 组件
    Table: {
      headerBg: colors.background.secondary,
      borderColor: colors.border.default,
    },

    // Input 组件
    Input: {
      paddingBlock: 8,
      paddingInline: 12,
      borderRadius: 8,
    },

    // Select 组件
    Select: {
      borderRadius: 8,
    },

    // Message 组件
    Message: {
      contentBg: colors.background.primary,
      borderRadiusLG: 8,
    },

    // Notification 组件
    Notification: {
      borderRadiusLG: 12,
    },

    // Divider 组件
    Divider: {
      colorSplit: colors.border.default,
    },
  },
  algorithm: undefined, // 使用默认算法
}

// 暗色主题配置
export const darkTheme: ThemeConfig = {
  token: {
    // 主色
    colorPrimary: colors.primary[400],
    colorSuccess: colors.success[400],
    colorWarning: colors.warning[400],
    colorError: colors.error[400],
    colorInfo: colors.info[400],

    // 文本颜色
    colorText: colors.dark.text.primary,
    colorTextSecondary: colors.dark.text.secondary,
    colorTextTertiary: colors.dark.text.tertiary,
    colorTextQuaternary: colors.neutral[600],

    // 背景颜色
    colorBgContainer: colors.dark.background.primary,
    colorBgElevated: colors.dark.background.secondary,
    colorBgLayout: colors.dark.background.primary,
    colorBgSpotlight: colors.dark.background.tertiary,

    // 边框
    colorBorder: colors.dark.border.default,
    colorBorderSecondary: colors.dark.border.hover,

    // 圆角
    borderRadius: 8,
    borderRadiusLG: 16,
    borderRadiusSM: 4,
    borderRadiusXS: 2,

    // 字体
    fontSize: 14,
    fontSizeHeading1: 36,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 18,

    // 阴影 (暗色主题阴影更深)
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.25)',
    boxShadowSecondary: '0 4px 20px rgba(0, 0, 0, 0.35)',

    // 控件高度
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,

    // 毛玻璃效果
    colorBgMask: 'rgba(0, 0, 0, 0.65)',

    // 链接
    colorLink: colors.primary[400],
    colorLinkHover: colors.primary[300],
    colorLinkActive: colors.primary[500],
  },
  components: {
    Button: {
      primaryShadow: '0 2px 8px rgba(255, 105, 180, 0.35)',
      algorithm: true,
    },
    Card: {
      boxShadowTertiary: '0 2px 12px rgba(0, 0, 0, 0.25)',
      paddingLG: 24,
      borderRadiusLG: 16,
    },
    Modal: {
      contentBg: colors.dark.background.secondary,
      headerBg: colors.dark.background.secondary,
      borderRadiusLG: 16,
    },
    Table: {
      headerBg: colors.dark.background.tertiary,
      borderColor: colors.dark.border.default,
    },
  },
  algorithm: undefined,
}

// 导出主题切换函数
export const getThemeConfig = (isDark: boolean): ThemeConfig => {
  return isDark ? darkTheme : lightTheme
}