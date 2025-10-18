/**
 * 鍓嶇鎬ц兘鐩戞帶 Hook
 * 闆嗘垚 Web Vitals API 鍜岃嚜瀹氫箟鎬ц兘鐩戞帶
 */

import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals'
import { usePerformanceStore, type PerformanceMetric } from '@shared/stores/performanceStore'

/**
 * 鎬ц兘鎸囨爣璇勫垎闃堝€?
 * 鍩轰簬 Google 鎺ㄨ崘鐨?Core Web Vitals 鏍囧噯
 */
const THRESHOLDS = {
  // Cumulative Layout Shift (CLS)
  CLS: { good: 0.1, poor: 0.25 },
  // First Contentful Paint (FCP) - ms
  FCP: { good: 1800, poor: 3000 },
  // Interaction to Next Paint (INP) - ms (替代 FID)
  INP: { good: 200, poor: 500 },
  // Largest Contentful Paint (LCP) - ms
  LCP: { good: 2500, poor: 4000 },
  // Time to First Byte (TTFB) - ms
  TTFB: { good: 800, poor: 1800 },
}

/**
 * 鑾峰彇鎬ц兘鎸囨爣璇勫垎
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'

  if (value <= threshold.good) return 'good'
  if (value > threshold.poor) return 'poor'
  return 'needs-improvement'
}

/**
 * 灏?Web Vitals Metric 杞崲涓?PerformanceMetric
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
 * 鍓嶇鎬ц兘鐩戞帶 Hook
 * 鑷姩鏀堕泦 Web Vitals 鎸囨爣銆丗PS銆佸唴瀛樹娇鐢ㄥ拰瀵艰埅鏁版嵁
 */
export function usePerformanceMonitor() {
  const addMetric = usePerformanceStore((state) => state.addMetric)
  const addFPS = usePerformanceStore((state) => state.addFPS)
  const updateMemory = usePerformanceStore((state) => state.updateMemory)
  const addNavigation = usePerformanceStore((state) => state.addNavigation)

  const location = useLocation()
  const enterTimeRef = useRef<number>(Date.now())
  const fpsIntervalRef = useRef<number | undefined>(undefined)
  const memoryIntervalRef = useRef<number | undefined>(undefined)

  /**
   * 鏀堕泦 Web Vitals 鎸囨爣
   */
  useEffect(() => {
    const handleMetric = (metric: Metric) => {
      addMetric(convertMetric(metric))
    }

    // 鐩戝惉 Core Web Vitals
    onCLS(handleMetric)
    onFCP(handleMetric)
    onINP(handleMetric)
    onLCP(handleMetric)
    onTTFB(handleMetric)
  }, [addMetric])

  /**
   * 鐩戞帶 FPS锛堝抚鐜囷級
   */
  useEffect(() => {
    let lastTime = performance.now()
    let frames = 0

    const measureFPS = () => {
      frames++
      const currentTime = performance.now()
      const elapsed = currentTime - lastTime

      // 姣忕璁＄畻涓€娆?FPS
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
   * 鐩戞帶鍐呭瓨浣跨敤锛堝鏋滄祻瑙堝櫒鏀寔锛?
   */
  useEffect(() => {
    // @ts-expect-error - performance.memory 鏄潪鏍囧噯 API
    if (!performance.memory) return

    let lastUsed = 0

    const measureMemory = () => {
      // @ts-expect-error - Node 环境缺少 performance.memory 类型
      const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory

      const used = usedJSHeapSize / (1024 * 1024) // 杞崲涓?MB
      const total = totalJSHeapSize / (1024 * 1024)
      const limit = jsHeapSizeLimit / (1024 * 1024)
      const increase = used - lastUsed

      updateMemory({ used, total, limit, increase })
      lastUsed = used
    }

    // 姣?2 绉掓洿鏂颁竴娆?
    const intervalId = window.setInterval(measureMemory, 2000)
    memoryIntervalRef.current = intervalId

    // 绔嬪嵆鎵ц涓€娆?
    measureMemory()

    return () => {
      window.clearInterval(intervalId)
    }
  }, [updateMemory])

  /**
   * 鐩戞帶璺敱瀵艰埅
   */
  useEffect(() => {
    const currentPath = location.pathname
    const enterTime = Date.now()
    enterTimeRef.current = enterTime

    // 璁板綍杩涘叆浜嬩欢
    addNavigation({
      path: currentPath,
      event: 'enter',
      timestamp: enterTime,
    })

    // 杩斿洖娓呯悊鍑芥暟锛岃褰曠寮€浜嬩欢
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

  // 杩斿洖涓€浜涙湁鐢ㄧ殑淇℃伅锛堝彲閫夛級
  return {
    isSupported: {
      webVitals: true,
      // @ts-expect-error - Node 环境下缺少 memory 字段
      memory: !!performance.memory,
      navigation: true,
    },
  }
}

export default usePerformanceMonitor
