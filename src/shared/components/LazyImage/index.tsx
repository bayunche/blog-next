/**
 * 懒加载图片组件
 * 支持图片懒加载、加载状态、错误处理、占位图
 */

import { useState, useEffect, useRef, type CSSProperties } from 'react'

export interface LazyImageProps {
  /** 图片地址 */
  src: string
  /** 图片描述 */
  alt: string
  /** 占位图（可选） */
  placeholder?: string
  /** 加载失败时的图片（可选） */
  fallback?: string
  /** 类名 */
  className?: string
  /** 样式 */
  style?: CSSProperties
  /** 根元素边距（用于提前加载） */
  rootMargin?: string
  /** 图片加载完成回调 */
  onLoad?: () => void
  /** 图片加载失败回调 */
  onError?: () => void
}

/**
 * 懒加载图片组件
 */
export function LazyImage({
  src,
  alt,
  placeholder,
  fallback = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="14"%3E加载失败%3C/text%3E%3C/svg%3E',
  className,
  style,
  rootMargin = '50px',
  onLoad,
  onError,
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(placeholder || '')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // 检查浏览器是否支持 IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // 不支持则直接加载图片
      loadImage()
      return
    }

    // 创建 IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage()
            // 加载后取消观察
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current)
            }
          }
        })
      },
      {
        rootMargin,
      }
    )

    // 开始观察
    if (imgRef.current) {
      observerRef.current.observe(imgRef.current)
    }

    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [src, rootMargin])

  // 加载图片
  const loadImage = () => {
    const img = new Image()

    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
      setHasError(false)
      onLoad?.()
    }

    img.onerror = () => {
      setImageSrc(fallback)
      setIsLoading(false)
      setHasError(true)
      onError?.()
    }

    img.src = src
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: isLoading ? 0.6 : 1,
        transition: 'opacity 0.3s ease-in-out',
      }}
      loading="lazy"
    />
  )
}

export default LazyImage
