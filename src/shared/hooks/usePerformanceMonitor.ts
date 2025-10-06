/**
 * 前端性能监控 Hook
 * 集成 Web Vitals API 和自定义性能监控
 */

import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { onCLS, onFCP, onFID, onLCP, onTTFB, type Metric } from 'web-vitals'
import { usePerformanceStore } from '@shared/stores/performanceStore'
import type { PerformanceMetric } from '@shared/stores/performanceStore'

/**
 * 性能指标评分阈值
 * 基于 Google 推荐的 Core Web Vitals 标准
 */
const THRESHOLDS = {
  // Cumulative Layout Shift (CLS)
  CLS: { good: 0.1, poor: 0.25 },
  // First Contentful Paint (FCP) - ms
  FCP: { good: 1800, poor: 3000 },
  // First Input Delay (FID) - ms
  FID: { good: 100, poor: 300 },
  // Largest Contentful Paint (LCP) - ms
  LCP: { good: 2500, poor: 4000 },
  // Time to First Byte (TTFB) - ms
  TTFB: { good: 800, poor: 1800 },
}

/**
 * 获取性能指标评分
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value > threshold.poor) return 'poor'
  return 'needs-improvement'
}

/**
 * 将 Web Vitals Metric 转换为 PerformanceMetric
 */
function convertMetric(metric: Metric): PerformanceMetric {
  return {
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    rating: getRating(metric.name, metric.value),
    timestamp: Date.now(),
  }
}

/**
 * 前端性能监控 Hook
 * 自动收集 Web Vitals 指标、FPS、内存使用和导航数据
 */
export function usePerformanceMonitor() {
  const addMetric = usePerformanceStore((state) => state.addMetric)
  const addFPS = usePerformanceStore((state) => state.addFPS)
  const updateMemory = usePerformanceStore((state) => state.updateMemory)
  const addNavigation = usePerformanceStore((state) => state.addNavigation)

  const location = useLocation()
  const enterTimeRef = useRef<number>(Date.now())
  const fpsIntervalRef = useRef<number>()
  const memoryIntervalRef = useRef<number>()

  /**
   * 收集 Web Vitals 指标
   */
  useEffect(() => {
    const handleMetric = (metric: Metric) => {
      addMetric(convertMetric(metric))
    }

    // 监听 Core Web Vitals
    onCLS(handleMetric)
    onFCP(handleMetric)
    onFID(handleMetric)
    onLCP(handleMetric)
    onTTFB(handleMetric)
  }, [addMetric])

  /**
   * 监控 FPS（帧率）
   */
  useEffect(() => {
    let lastTime = performance.now()
    let frames = 0

    const measureFPS = () => {
      frames++
      const currentTime = performance.now()
      const elapsed = currentTime - lastTime

      // 每秒计算一次 FPS
      if (elapsed >= 1000) {
        const fps = Math.round((frames * 1000) / elapsed)
        addFPS(fps)

        frames = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measureFPS)
    }

    const rafId = requestAnimationFrame(measureFPS)

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [addFPS])

  /**
   * 监控内存使用（如果浏览器支持）
   */
  useEffect(() => {
    // @ts-ignore - performance.memory 是非标准 API
    if (!performance.memory) return

    let lastUsed = 0

    const measureMemory = () => {
      // @ts-ignore
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory

      const used = usedJSHeapSize / (1024 * 1024) // 转换为 MB
      const total = totalJSHeapSize / (1024 * 1024)
      const limit = jsHeapSizeLimit / (1024 * 1024)
      const increase = used - lastUsed

      updateMemory({ used, total, limit, increase })
      lastUsed = used
    }

    // 每 2 秒更新一次
    const intervalId = window.setInterval(measureMemory, 2000)
    memoryIntervalRef.current = intervalId

    // 立即执行一次
    measureMemory()

    return () => {
      window.clearInterval(intervalId)
    }
  }, [updateMemory])

  /**
   * 监控路由导航
   */
  useEffect(() => {
    const currentPath = location.pathname
    const enterTime = Date.now()
    enterTimeRef.current = enterTime

    // 记录进入事件
    addNavigation({
      path: currentPath,
      event: 'enter',
      timestamp: enterTime,
    })

    // 返回清理函数，记录离开事件
    return () => {
      const leaveTime = Date.now()
      const duration = leaveTime - enterTimeRef.current

      addNavigation({
        path: currentPath,
        event: 'leave',
        timestamp: leaveTime,
        duration,
      })
    }
  }, [location.pathname, addNavigation])

  // 返回一些有用的信息（可选）
  return {
    isSupported: {
      webVitals: true,
      // @ts-ignore
      memory: !!performance.memory,
      navigation: true,
    },
  }
}

export default usePerformanceMonitor
