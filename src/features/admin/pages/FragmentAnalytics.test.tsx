import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@/test/utils/test-utils'
import { FragmentAnalytics } from './FragmentAnalytics'

vi.mock('@features/fragment', () => {
  return {
    useFragmentList: () => ({
      data: {
        list: [
          {
            id: 1,
            author: 'Alice',
            content: '第一条碎片',
            createdAt: '2025-10-01T08:00:00.000Z',
          },
          {
            id: 2,
            author: 'Bob',
            content: '第二条碎片',
            createdAt: '2025-10-01T12:00:00.000Z',
          },
          {
            id: 3,
            author: 'Alice',
            content: '第三条碎片',
            createdAt: '2025-10-02T01:00:00.000Z',
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isFetching: false,
    }),
  }
})

vi.mock('@ant-design/plots', () => ({
  Line: ({ data }: { data: Array<{ date: string; count: number }> }) => (
    <div data-testid="fragment-analytics-plot" data-count={data.length} />
  ),
}))

describe('FragmentAnalytics', () => {
  it('renders statistics and chart based on fragment data', () => {
    render(<FragmentAnalytics />)

    expect(screen.getByText('碎片趋势分析')).toBeVisible()
    expect(screen.getByText('碎片总数')).toBeVisible()

    const totalCard = screen.getByText('碎片总数').closest('div.ant-statistic')
    expect(totalCard?.textContent).toContain('3')

    const authorCard = screen.getByText('活跃作者数').closest('div.ant-statistic')
    expect(authorCard?.textContent).toContain('2')

    const avgCard = screen.getByText('平均每日发布').closest('div.ant-statistic')
    expect(avgCard?.textContent).toMatch(/1\.5/)

    const chart = screen.getByTestId('fragment-analytics-plot')
    expect(chart).toHaveAttribute('data-count', '2')

    const list = screen.getByRole('list')
    expect(within(list).getByText('第一条碎片')).toBeVisible()
    expect(within(list).getByText('第三条碎片')).toBeVisible()
  })
})
