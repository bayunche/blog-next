/**
 * Monitor 页面单元测试
 */
import { act, render, screen } from '@testing-library/react'
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from 'vitest'
import Monitor from './Monitor'
import { usePerformanceStore } from '@shared/stores/performanceStore'

vi.mock('@ant-design/plots', () => ({
  Line: () => <div data-testid="monitor-line" />,
  Area: () => <div data-testid="monitor-area" />,
}))

vi.mock('../hooks/useSystemMonitor', () => ({
  useSystemMonitor: () => ({ isConnected: true }),
}))

describe('Monitor', () => {
  const originalFetch = globalThis.fetch

  beforeAll(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response())) as typeof fetch)
  })

  afterAll(() => {
    if (originalFetch) {
      vi.stubGlobal('fetch', originalFetch)
    } else {
      vi.unstubAllGlobals()
    }
  })

  beforeEach(() => {
    const { clearMetrics } = usePerformanceStore.getState()
    clearMetrics()
  })

  it('renders empty states when no metrics collected', () => {
    render(<Monitor />)

    expect(screen.getByText(/Socket 已连接/)).toBeInTheDocument()
    expect(screen.getByText(/暂无系统指标/)).toBeInTheDocument()
    expect(screen.getByText(/暂无性能指标/)).toBeInTheDocument()
  })

  it('renders live metrics when store contains data', async () => {
    const now = Date.now()

    await act(async () => {
      usePerformanceStore.setState((state) => ({
        systemPerformance: [
          ...state.systemPerformance,
          { cpuUsage: 0.52, memoryUsage: 0.33, timestamp: now },
        ],
        metrics: [
          {
            name: 'CLS',
            value: 0.11,
            delta: 0,
            rating: 'good',
            timestamp: now,
          },
        ],
        fpsHistory: [
          { fps: 58, timestamp: now },
        ],
        memoryUsage: {
          used: 512,
          total: 1024,
          limit: 2048,
          increase: 12,
        },
        navigationHistory: [
          {
            path: '/',
            event: 'enter',
            timestamp: now,
          },
        ],
      }))
    })

    render(<Monitor />)

    expect(screen.getByText(/CPU 使用率/)).toBeInTheDocument()
    expect(screen.getByText(/52%/)).toBeInTheDocument()
    expect(screen.getByText(/JS 内存使用/)).toBeInTheDocument()
    expect(screen.getByText(/CLS/)).toBeInTheDocument()
  })
})
