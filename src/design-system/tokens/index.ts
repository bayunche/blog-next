/**
 * 设计令牌系统
 * 导出所有设计令牌
 */

export { colors, type ColorToken } from './colors'
export { spacing, type SpacingToken } from './spacing'
export { typography, type TypographyToken } from './typography'
export { shadows, type ShadowToken } from './shadows'

// 导出完整的设计令牌类型
export type DesignTokens = {
  colors: ColorToken
  spacing: SpacingToken
  typography: TypographyToken
  shadows: ShadowToken
}