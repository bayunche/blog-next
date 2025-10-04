/**
 * useDebounce Hook 测试
 */

import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 100))
    expect(result.current).toBe('test')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 100 },
      }
    )

    expect(result.current).toBe('initial')

    // 更新值
    rerender({ value: 'updated', delay: 100 })

    // 值应该还是 initial（未到延迟时间）
    expect(result.current).toBe('initial')

    // 等待状态更新
    await waitFor(
      () => {
        expect(result.current).toBe('updated')
      },
      { timeout: 200 }
    )
  })

  it('should cancel previous debounce on new value', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      {
        initialProps: { value: 'initial' },
      }
    )

    // 第一次更新
    rerender({ value: 'first' })

    // 快速第二次更新（取消第一次）
    await new Promise((resolve) => setTimeout(resolve, 50))
    rerender({ value: 'second' })

    await waitFor(
      () => {
        expect(result.current).toBe('second')
      },
      { timeout: 200 }
    )
  })

  it('should handle different delay times', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 150 },
      }
    )

    rerender({ value: 'updated', delay: 150 })

    // 在延迟时间内，值应该还是 initial
    expect(result.current).toBe('initial')

    await waitFor(
      () => {
        expect(result.current).toBe('updated')
      },
      { timeout: 250 }
    )
  })
})
