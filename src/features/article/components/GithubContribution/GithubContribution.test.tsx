/**
 * GithubContribution 组件测试
 */
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { GithubContribution } from './GithubContribution'
import { useGithubContributions } from '@features/article/hooks/useGithubContributions'

vi.mock('@features/article/hooks/useGithubContributions')

describe('GithubContribution', () => {
  it('renders loading state', () => {
    vi.mocked(useGithubContributions).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: undefined,
    } as any)

    render(<GithubContribution />)

    expect(screen.getByTestId('github-contribution-loading')).toBeInTheDocument()
    expect(screen.getByText(/GitHub Contributions/)).toBeInTheDocument()
  })

  it('renders heatmap when data available', () => {
    vi.mocked(useGithubContributions).mockReturnValue({
      data: [
        { date: '2025-10-01', count: 5 },
        { date: '2025-10-02', count: 0 },
      ],
      isLoading: false,
      isError: false,
      error: undefined,
    } as any)

    render(<GithubContribution />)

    expect(screen.getByText(/GitHub Contributions/)).toBeInTheDocument()
    expect(screen.getByText(/public GitHub contribution records/)).toBeInTheDocument()
  })

  it('renders error state', () => {
    vi.mocked(useGithubContributions).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Oops'),
    } as any)

    render(<GithubContribution />)

    expect(screen.getByText(/Failed to load GitHub contributions/)).toBeInTheDocument()
    expect(screen.getByText(/Oops/)).toBeInTheDocument()
  })

  it('renders empty state', () => {
    vi.mocked(useGithubContributions).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: undefined,
    } as any)

    render(<GithubContribution />)

    expect(screen.getByText(/No contributions recorded/)).toBeInTheDocument()
  })
})
