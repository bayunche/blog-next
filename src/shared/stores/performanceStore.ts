/**
 * 性能监控状态管理 Store
 * 使用 Zustand 管理前端和后端性能数据
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * 性能指标类型
 */
export interface PerformanceMetric {
  name: string
  value: number
  delta: number | null
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

/**
 * FPS 记录
 */
export interface FPSRecord {
  fps: number
  timestamp: number
}

/**
 * 内存统计
 */
export interface MemoryStats {
  used: number // MB
  total: number // MB
  limit: number // MB
  increase: number // MB（相对于上次）
}

/**
 * 导航记录
 */
export interface NavigationRecord {
  path: string
  event: 'enter' | 'leave'
  timestamp: number
  duration?: number // 停留时长（ms）
}

/**
 * 系统性能数据（来自 Socket.io）
 */
export interface SystemPerformance {
  cpuUsage: number // 0-1
  memoryUsage: number // 0-1
  timestamp: number
}

/**
 * 性能监控 Store 状态
 */
interface PerformanceStore {
  // 前端性能指标（Web Vitals）
  metrics: PerformanceMetric[]

  // FPS 历史记录
  fpsHistory: FPSRecord[]

  // 内存使用统计
  memoryUsage: MemoryStats | null

  // 导航历史记录
  navigationHistory: NavigationRecord[]

  // 系统性能数据（CPU/内存）
  systemPerformance: SystemPerformance[]

  // Actions
  addMetric: (metric: PerformanceMetric) => void
  addFPS: (fps: number) => void
  updateMemory: (stats: MemoryStats) => void
  addNavigation: (record: NavigationRecord) => void
  addSystemPerformance: (data: SystemPerformance) => void
  clearMetrics: () => void
}

/**
 * 历史记录最大长度限制（防止内存泄漏）
 */
const MAX_METRICS = 50
const MAX_FPS_HISTORY = 60 // 1分钟（假设1秒1次）
const MAX_NAVIGATION = 20
const MAX_SYSTEM_PERFORMANCE = 120 // 2分钟（假设1秒1次）

/**
 * 创建 Performance Store
 */
export const usePerformanceStore = create<PerformanceStore>()(
  devtools(
    (set) => ({
      metrics: [],
      fpsHistory: [],
      memoryUsage: null,
      navigationHistory: [],
      systemPerformance: [],

      /**
       * 添加性能指标
       */
      addMetric: (metric: PerformanceMetric) =>
        set((state) => ({
          metrics: [metric, ...state.metrics].slice(0, MAX_METRICS),
        })),

      /**
       * 添加 FPS 记录
       */
      addFPS: (fps: number) =>
        set((state) => ({
          fpsHistory: [
            ...state.fpsHistory,
            { fps, timestamp: Date.now() },
          ].slice(-MAX_FPS_HISTORY),
        })),

      /**
       * 更新内存使用统计
       */
      updateMemory: (stats: MemoryStats) =>
        set(() => ({
          memoryUsage: stats,
        })),

      /**
       * 添加导航记录
       */
      addNavigation: (record: NavigationRecord) =>
        set((state) => {
          const history = [record, ...state.navigationHistory].slice(0, MAX_NAVIGATION)

          // 如果是离开事件，计算停留时长
          if (record.event === 'leave' && history.length > 1) {
            const enterRecord = history.find(
              (r) => r.event === 'enter' && r.path === record.path
            )
            if (enterRecord) {
              record.duration = record.timestamp - enterRecord.timestamp
            }
          }

          return { navigationHistory: history }
        }),

      /**
       * 添加系统性能数据
       */
      addSystemPerformance: (data: SystemPerformance) =>
        set((state) => ({
          systemPerformance: [
            ...state.systemPerformance,
            data,
          ].slice(-MAX_SYSTEM_PERFORMANCE),
        })),

      /**
       * 清空所有指标（用于测试或重置）
       */
      clearMetrics: () =>
        set(() => ({
          metrics: [],
          fpsHistory: [],
          memoryUsage: null,
          navigationHistory: [],
          systemPerformance: [],
        })),
    }),
    { name: 'PerformanceStore' }
  )
)

export default usePerformanceStore
