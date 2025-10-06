import { describe, expect, it } from 'vitest'
import { render, screen } from '@/test/utils/test-utils'
import { NotFoundPage } from './NotFoundPage'

describe('NotFoundPage', () => {
  it('renders 404 copy and action', () => {
    render(<NotFoundPage />)
    expect(screen.getByText('抱歉，您访问的页面不存在。')).toBeVisible()
    expect(screen.getByRole('button', { name: '返回首页' })).toBeVisible()
  })
})
