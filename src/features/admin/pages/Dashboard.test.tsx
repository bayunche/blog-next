import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Dashboard } from './Dashboard'
import { useDashboardOverview } from '../hooks/useDashboardOverview'

vi.mock('../hooks/useDashboardOverview')

describe('Dashboard page', () => {
  it('renders statistics and table when data is available', () => {
    vi.mocked(useDashboardOverview).mockReturnValue({
      data: {
        stats: {
          articleCount: 12,
          userCount: 5,
          commentCount: 30,
          viewCount: 1024,
        },
        recentArticles: [
          {
            id: 1,
            title: 'Test Article',
            createdAt: '2025-10-01 08:00:00',
            viewCount: 200,
            likeCount: 20,
            status: 'published',
          },
        ],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
      isFetching: false,
    } as any)

    render(<Dashboard />)

    expect(screen.getByText(/文章总数/)).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText(/Test Article/)).toBeInTheDocument()
    expect(screen.getByText(/已发布/)).toBeInTheDocument()
  })

  it('renders error state when request fails', () => {
    const refetch = vi.fn()
    vi.mocked(useDashboardOverview).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch,
      isFetching: false,
    } as any)

    render(<Dashboard />)

    expect(screen.getByText(/仪表盘数据加载失败/)).toBeInTheDocument()
    screen.getByRole('button', { name: /重试/ }).click()
    expect(refetch).toHaveBeenCalled()
  })
})
