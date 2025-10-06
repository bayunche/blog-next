import { render, screen } from "@testing-library/react"
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from "vitest"
import Monitor from "./Monitor"
import { usePerformanceStore } from "@shared/stores/performanceStore"

defineVitestMocks()

// 模拟 socket Hook，避免测试期间建立真实连接
vi.mock("../hooks/useSystemMonitor", () => ({
  useSystemMonitor: () => ({ isConnected: true }),
}))

function defineVitestMocks() {
  if (!global.fetch) {
    // @ts-ignore
    global.fetch = vi.fn()
  }
}

describe("Monitor", () => {
  const originalFetch = global.fetch

  beforeAll(() => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: true })) as any
  })

  afterAll(() => {
    global.fetch = originalFetch
  })

  beforeEach(() => {
    const { clearMetrics } = usePerformanceStore.getState()
    clearMetrics()
  })

  it("renders empty states when no performance data", () => {
    render(<Monitor />)

    expect(screen.getByText(/Socket 已连接/)).toBeInTheDocument()
    expect(screen.getByText(/暂无系统指标/)).toBeInTheDocument()
    expect(screen.getByText(/暂无性能指标/)).toBeInTheDocument()
  })

  it("renders latest cpu and memory utilisation when data available", () => {
    const now = Date.now()

    usePerformanceStore.setState((state) => ({
      systemPerformance: [
        ...state.systemPerformance,
        { cpuUsage: 0.52, memoryUsage: 0.33, timestamp: now },
      ],
      metrics: [
        {
          name: "CLS",
          value: 0.11,
          delta: 0,
          rating: "good",
          timestamp: now,
        },
      ],
      fpsHistory: [
        {
          fps: 58,
          timestamp: now,
        },
      ],
      memoryUsage: {
        used: 512,
        total: 1024,
        limit: 2048,
        increase: 12,
      },
      navigationHistory: [
        {
          path: "/home",
          event: "enter",
          timestamp: now,
        },
      ],
    }))

    render(<Monitor />)

    expect(screen.getByText(/CPU 使用率/)).toBeInTheDocument()
    expect(screen.getByText(/52%/)).toBeInTheDocument()
    expect(screen.getByText(/JS 内存使用/)).toBeInTheDocument()
    expect(screen.getByText(/CLS/)).toBeInTheDocument()
  })
})
