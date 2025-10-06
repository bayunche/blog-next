import { render, screen } from '@testing-library/react'
import { vi, type MockedFunction } from 'vitest'
import { GithubLoginingPage } from './GithubLoginingPage'
import { useGithubAuth } from '../hooks'

vi.mock('../hooks', () => ({
  useGithubAuth: vi.fn(),
}))

const mockedUseGithubAuth = useGithubAuth as unknown as MockedFunction<typeof useGithubAuth>

describe('GithubLoginingPage', () => {
  beforeEach(() => {
    mockedUseGithubAuth.mockReset()
  })

  it('starts GitHub auth when available', () => {
    const startGithubAuth = vi.fn()
    mockedUseGithubAuth.mockReturnValue({
      isGithubAuthAvailable: true,
      startGithubAuth,
      isProcessing: true,
      error: null,
    } as any)

    render(<GithubLoginingPage />)

    expect(startGithubAuth).toHaveBeenCalledTimes(1)
  })

  it('shows warning when GitHub auth is unavailable', () => {
    mockedUseGithubAuth.mockReturnValue({
      isGithubAuthAvailable: false,
      startGithubAuth: vi.fn(),
      isProcessing: false,
      error: null,
    } as any)

    render(<GithubLoginingPage />)

    expect(screen.getByText(/GitHub OAuth 未配置/)).toBeInTheDocument()
    expect(screen.getByText(/返回首页/)).toBeInTheDocument()
  })

  it('renders error alert when authorization fails', () => {
    mockedUseGithubAuth.mockReturnValue({
      isGithubAuthAvailable: true,
      startGithubAuth: vi.fn(),
      isProcessing: false,
      error: new Error('Network error'),
    } as any)

    render(<GithubLoginingPage />)

    expect(screen.getByText(/登录失败/)).toBeInTheDocument()
    expect(screen.getByText(/Network error/)).toBeInTheDocument()
  })
})
