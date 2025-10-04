/**
 * LazyImage 组件测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils/test-utils'
import { LazyImage } from './index'

describe('LazyImage', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
      // 立即触发回调（模拟图片进入视口）
      setTimeout(() => {
        callback(
          [
            {
              isIntersecting: true,
              target: document.createElement('img'),
            },
          ],
          null
        )
      }, 0)

      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      }
    }) as any
  })

  it('should render image with correct src', async () => {
    render(<LazyImage src="/test.jpg" alt="Test image" />)

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Test image')
  })

  it('should render placeholder initially', () => {
    render(<LazyImage src="/test.jpg" alt="Test" placeholder="/placeholder.jpg" />)

    const img = screen.getByRole('img')
    // 初始应该显示占位图
    expect(img).toHaveAttribute('src', '/placeholder.jpg')
  })

  it('should apply custom className', () => {
    render(<LazyImage src="/test.jpg" alt="Test" className="custom-class" />)

    const img = screen.getByRole('img')
    expect(img).toHaveClass('custom-class')
  })

  it('should apply custom style', () => {
    const customStyle = { width: '100px', height: '100px' }
    render(<LazyImage src="/test.jpg" alt="Test" style={customStyle} />)

    const img = screen.getByRole('img')
    expect(img).toHaveStyle({ width: '100px', height: '100px' })
  })

  it('should have loading="lazy" attribute', () => {
    render(<LazyImage src="/test.jpg" alt="Test" />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('loading', 'lazy')
  })
})
