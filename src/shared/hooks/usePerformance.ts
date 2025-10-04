/**
 * 性能监控 Hook
 * 用于监控 Web Vitals 性能指标
 */

import { useEffect } from 'react'

export interface PerformanceMetrics {
  /** 首次内容绘制 (First Contentful Paint) */
  FCP?: number
  /** 最大内容绘制 (Largest Contentful Paint) */
  LCP?: number
  /** 首次输入延迟 (First Input Delay) */
  FID?: number
  /** 累积布局偏移 (Cumulative Layout Shift) */
  CLS?: number
  /** 首次字节时间 (Time to First Byte) */
  TTFB?: number
}

/**
 * 性能监控 Hook
 */
export function usePerformance(
  onMetrics?: (metrics: PerformanceMetrics) => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const metrics: PerformanceMetrics = {}

    // 监控 FCP (First Contentful Paint)
    const observeFCP = () => {
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        metrics.FCP = fcpEntry.startTime
      }
    }

    // 监控 LCP (Largest Contentful Paint)
    const observeLCP = () => {
      if (!('PerformanceObserver' in window)) return

      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
            renderTime?: number
            loadTime?: number
          }
          metrics.LCP = lastEntry.renderTime || lastEntry.loadTime || 0
        })

        observer.observe({ entryTypes: ['largest-contentful-paint'] })

        return () => observer.disconnect()
      } catch (error) {
        console.warn('LCP observer failed:', error)
      }
    }

    // 监控 FID (First Input Delay)
    const observeFID = () => {
      if (!('PerformanceObserver' in window)) return

      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const firstInput = entries[0] as PerformanceEntry & {
            processingStart?: number
          }
          metrics.FID = firstInput.processingStart
            ? firstInput.processingStart - firstInput.startTime
            : 0
        })

        observer.observe({ entryTypes: ['first-input'] })

        return () => observer.disconnect()
      } catch (error) {
        console.warn('FID observer failed:', error)
      }
    }

    // 监控 CLS (Cumulative Layout Shift)
    const observeCLS = () => {
      if (!('PerformanceObserver' in window)) return

      try {
        let clsValue = 0

        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: PerformanceEntry & { value?: number; hadRecentInput?: boolean }) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value || 0
              metrics.CLS = clsValue
            }
          })
        })

        observer.observe({ entryTypes: ['layout-shift'] })

        return () => observer.disconnect()
      } catch (error) {
        console.warn('CLS observer failed:', error)
      }
    }

    // 监控 TTFB (Time to First Byte)
    const observeTTFB = () => {
      const navigationEntry = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming

      if (navigationEntry) {
        metrics.TTFB = navigationEntry.responseStart - navigationEntry.requestStart
      }
    }

    // 执行所有监控
    observeFCP()
    const lcpCleanup = observeLCP()
    const fidCleanup = observeFID()
    const clsCleanup = observeCLS()
    observeTTFB()

    // 页面卸载时上报指标
    const reportMetrics = () => {
      if (onMetrics && Object.keys(metrics).length > 0) {
        onMetrics(metrics)
      }
    }

    // 页面隐藏或卸载时上报
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportMetrics()
      }
    })

    window.addEventListener('beforeunload', reportMetrics)

    // 3秒后也上报一次（用于开发调试）
    const timer = setTimeout(reportMetrics, 3000)

    return () => {
      clearTimeout(timer)
      lcpCleanup?.()
      fidCleanup?.()
      clsCleanup?.()
    }
  }, [enabled, onMetrics])
}

/**
 * 获取当前页面性能指标
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  if (typeof window === 'undefined') return {}

  const metrics: PerformanceMetrics = {}
  const navigationEntry = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming

  if (navigationEntry) {
    metrics.TTFB = navigationEntry.responseStart - navigationEntry.requestStart
  }

  const paintEntries = performance.getEntriesByType('paint')
  const fcpEntry = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
  if (fcpEntry) {
    metrics.FCP = fcpEntry.startTime
  }

  return metrics
}
