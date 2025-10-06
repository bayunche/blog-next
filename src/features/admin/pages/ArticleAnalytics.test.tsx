import { render, screen } from '@testing-library/react'
import { vi, type MockedFunction } from 'vitest'
import { ArticleAnalytics } from './ArticleAnalytics'
import { useArticleAnalytics } from '../hooks/useArticleAnalytics'

vi.mock('@ant-design/plots', () => ({
  Line: ({ data }: { data: Array<{ date: string; count: number }> }) => (
    <div data-testid="article-analytics-plot" data-count={data.length} />
  ),
}))

vi.mock('../hooks/useArticleAnalytics', () => ({
  useArticleAnalytics: vi.fn(),
}))

const mockedUseArticleAnalytics = useArticleAnalytics as unknown as MockedFunction<typeof useArticleAnalytics>

describe('ArticleAnalytics', () => {
  beforeEach(() => {
    mockedUseArticleAnalytics.mockReset()
  })

  it('renders loading skeleton', () => {
    mockedUseArticleAnalytics.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isFetching: false,
    } as any)

    render(<ArticleAnalytics />)

    expect(screen.getByTestId('article-analytics-loading')).toBeInTheDocument()
  })

  it('renders analytics summary and chart', () => {
    mockedUseArticleAnalytics.mockReturnValue({
      data: {
        records: [
          { articleId: 1, articleLabel: '文章 #1', date: '2024-05-01', count: 3 },
          { articleId: 2, articleLabel: '文章 #2', date: '2024-05-01', count: 2 },
        ],
        summary: {
          totalReads: 5,
          uniqueArticles: 2,
          startDate: '2024-05-01',
          endDate: '2024-05-02',
          topArticles: [
            { articleId: 1, articleLabel: '文章 #1', total: 3 },
            { articleId: 2, articleLabel: '文章 #2', total: 2 },
          ],
        },
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isFetching: false,
    } as any)

    render(<ArticleAnalytics />)

    expect(screen.getByTestId('article-analytics')).toBeInTheDocument()
    expect(screen.getByTestId('article-analytics-total').textContent).toContain('5')
    expect(screen.getByTestId('article-analytics-unique').textContent).toContain('2')
    expect(screen.getByTestId('article-analytics-range').textContent).toContain('2024-05-01')
    expect(screen.getByTestId('article-analytics-plot')).toHaveAttribute('data-count', '2')
  })

  it('renders error state', () => {
    const refetch = vi.fn()
    mockedUseArticleAnalytics.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Network issue'),
      refetch,
      isFetching: false,
    } as any)

    render(<ArticleAnalytics />)

    expect(screen.getByTestId('article-analytics-error')).toBeInTheDocument()
    expect(screen.getByText(/Network issue/)).toBeInTheDocument()
  })
})
