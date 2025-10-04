/**
 * 节流 Hook
 * 用于限制函数执行频率，在指定时间内最多执行一次
 */

import { useEffect, useRef, useState } from 'react'

/**
 * 节流值 Hook
 * @param value 需要节流的值
 * @param delay 时间间隔（毫秒）
 * @returns 节流后的值
 */
export function useThrottle<T>(value: T, delay: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastExecuted = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecuted.current

    if (timeSinceLastExecution >= delay) {
      setThrottledValue(value)
      lastExecuted.current = now
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value)
        lastExecuted.current = Date.now()
      }, delay - timeSinceLastExecution)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [value, delay])

  return throttledValue
}

/**
 * 节流回调 Hook
 * @param callback 需要节流的回调函数
 * @param delay 时间间隔（毫秒）
 * @param deps 依赖项数组
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  deps: React.DependencyList = []
) {
  const lastExecuted = useRef<number>(0)
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return ((...args: Parameters<T>) => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecuted.current

    if (timeSinceLastExecution >= delay) {
      callback(...args)
      lastExecuted.current = now
    } else {
      if (timer.current) clearTimeout(timer.current)

      timer.current = setTimeout(
        () => {
          callback(...args)
          lastExecuted.current = Date.now()
        },
        delay - timeSinceLastExecution
      )
    }
  }) as T
}
