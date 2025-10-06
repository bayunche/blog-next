import { render, screen } from '@testing-library/react'
import { vi, type MockedFunction } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ArchivesPage } from './ArchivesPage'
import { useArchives } from '../hooks'

vi.mock('../hooks', () => ({
  useArchives: vi.fn(),
}))

const mockedUseArchives = useArchives as unknown as MockedFunction<typeof useArchives>

describe('ArchivesPage', () => {
  beforeEach(() => {
    mockedUseArchives.mockReset()
  })

  it('展示加载状态', () => {
    mockedUseArchives.mockReturnValue({ data: undefined, isLoading: true, error: null } as any)

    render(
      <MemoryRouter>
        <ArchivesPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('archives-loading')).toBeInTheDocument()
  })

  it('展示空状态', () => {
    mockedUseArchives.mockReturnValue({ data: { years: [], total: 0 }, isLoading: false, error: null } as any)

    render(
      <MemoryRouter>
        <ArchivesPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('archives-empty')).toBeInTheDocument()
  })

  it('展示归档时间线', () => {
    mockedUseArchives.mockReturnValue({
      data: {
        total: 2,
        years: [
          {
            year: 2024,
            count: 2,
            months: [
              {
                month: 5,
                count: 2,
                articles: [
                  {
                    id: 2,
                    title: '第二篇文章',
                    description: '',
                    cover: null,
                    viewCount: 5,
                    likeCount: 1,
                    commentCount: 0,
                    category: { id: 8, name: '后端' },
                    tags: [{ id: 1, name: 'Node.js' }],
                    createdAt: '2024-05-10 12:00:00',
                    updatedAt: '2024-05-11 12:00:00',
                  },
                  {
                    id: 1,
                    title: '第一篇文章',
                    description: '',
                    cover: null,
                    viewCount: 10,
                    likeCount: 2,
                    commentCount: 1,
                    category: { id: 7, name: '前端' },
                    tags: [],
                    createdAt: '2024-05-01 10:00:00',
                    updatedAt: '2024-05-02 10:00:00',
                  },
                ],
              },
            ],
          },
        ],
      },
      isLoading: false,
      error: null,
    } as any)

    render(
      <MemoryRouter>
        <ArchivesPage />
      </MemoryRouter>
    )

    const container = screen.getByTestId('archives-content')
    expect(container).toBeInTheDocument()

    const articleLinks = screen.getAllByRole('link')
    expect(articleLinks.some((link) => link.getAttribute('href') === '/article/2')).toBe(true)
  })
})
