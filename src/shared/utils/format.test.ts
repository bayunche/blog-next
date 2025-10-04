/**
 * 格式化工具函数测试
 */

import { describe, it, expect } from 'vitest'
import { formatDate, formatNumber, truncateText } from './format'

describe('formatDate', () => {
  it('should format date to YYYY-MM-DD', () => {
    const date = new Date('2025-10-01T12:00:00')
    expect(formatDate(date)).toBe('2025-10-01')
  })

  it('should format date with custom format', () => {
    const date = new Date('2025-10-01T12:30:45')
    expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2025-10-01 12:30:45')
  })

  it('should handle invalid date', () => {
    expect(formatDate(new Date('invalid'))).toBe('Invalid Date')
  })
})

describe('formatNumber', () => {
  it('should format number with thousand separator', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('should handle negative number', () => {
    expect(formatNumber(-1234)).toBe('-1,234')
  })

  it('should handle decimal number', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56')
  })
})

describe('truncateText', () => {
  it('should truncate text to specified length', () => {
    const text = 'This is a long text that needs to be truncated'
    expect(truncateText(text, 20)).toBe('This is a long text...')
  })

  it('should not truncate short text', () => {
    const text = 'Short text'
    expect(truncateText(text, 20)).toBe('Short text')
  })

  it('should use custom suffix', () => {
    const text = 'This is a long text'
    expect(truncateText(text, 10, '>>>')).toBe('This is a>>>')
  })

  it('should handle empty string', () => {
    expect(truncateText('', 10)).toBe('')
  })
})
