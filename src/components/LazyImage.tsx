'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';

interface LazyImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    containerClassName?: string;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

// 默认的模糊占位图 (1x1 像素的浅灰色)
const DEFAULT_BLUR_DATA_URL =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=';

/**
 * 懒加载图片组件
 * 
 * 结合 IntersectionObserver 实现图片仅在视口内加载，
 * 配合淡入动画提供流畅的加载体验。
 */
export const LazyImage = ({
    src,
    alt,
    width,
    height,
    fill = false,
    className = '',
    containerClassName = '',
    priority = false,
    placeholder = 'blur',
    blurDataURL = DEFAULT_BLUR_DATA_URL,
    objectFit = 'cover',
}: LazyImageProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // 使用 IntersectionObserver 检测元素是否进入视口
    useEffect(() => {
        if (priority) {
            // 高优先级图片立即加载
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px', // 提前 200px 开始加载
                threshold: 0.01,
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [priority]);

    // 图片加载完成回调
    const handleLoad = () => {
        setIsLoaded(true);
    };

    // 图片加载失败回调
    const handleError = () => {
        setHasError(true);
    };

    // 占位符渲染
    const renderPlaceholder = () => (
        <div
            className={clsx(
                'absolute inset-0 flex items-center justify-center',
                'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800',
                'transition-opacity duration-300',
                isLoaded ? 'opacity-0' : 'opacity-100'
            )}
        >
            {/* 加载动画 */}
            {!hasError && (
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {/* 错误状态 */}
            {hasError && (
                <div className="text-center text-text-muted">
                    <svg
                        className="w-12 h-12 mx-auto mb-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span className="text-xs">加载失败</span>
                </div>
            )}
        </div>
    );

    return (
        <div
            ref={containerRef}
            className={clsx(
                'relative overflow-hidden',
                containerClassName
            )}
            style={!fill && width && height ? { width, height } : undefined}
        >
            {/* 占位符 */}
            {renderPlaceholder()}

            {/* 实际图片 - 仅在可见时渲染 */}
            {isVisible && !hasError && (
                <Image
                    src={src}
                    alt={alt}
                    fill={fill}
                    width={!fill ? width : undefined}
                    height={!fill ? height : undefined}
                    className={clsx(
                        'transition-all duration-500',
                        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
                        objectFit === 'cover' && 'object-cover',
                        objectFit === 'contain' && 'object-contain',
                        objectFit === 'fill' && 'object-fill',
                        className
                    )}
                    onLoad={handleLoad}
                    onError={handleError}
                    placeholder={placeholder}
                    blurDataURL={blurDataURL}
                    priority={priority}
                />
            )}
        </div>
    );
};

/**
 * 随机封面图组件
 * 
 * 如果没有提供 src，将使用必应每日壁纸 API 获取随机图片
 */
export const RandomCoverImage = ({
    src,
    alt,
    ...props
}: Omit<LazyImageProps, 'src'> & { src?: string }) => {
    const [imageSrc, setImageSrc] = useState(src || '');

    useEffect(() => {
        if (!src) {
            // 使用必应每日图片 API
            const randomIndex = Math.floor(Math.random() * 8);
            setImageSrc(`https://api.dujin.org/bing/1920.php?rand=${randomIndex}`);
        }
    }, [src]);

    if (!imageSrc) {
        return (
            <div
                className={clsx(
                    'bg-gradient-to-br from-primary/20 to-pink-500/20',
                    props.containerClassName
                )}
            />
        );
    }

    return <LazyImage src={imageSrc} alt={alt} {...props} />;
};

export default LazyImage;
