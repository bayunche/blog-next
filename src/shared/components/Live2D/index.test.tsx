import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, cleanup, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Live2D } from './index'

let loadOml2dMock: ReturnType<typeof vi.fn>

vi.mock('oh-my-live2d', () => ({
  loadOml2d: (...args: unknown[]) => loadOml2dMock(...args),
}))

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn(() => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

beforeEach(() => {
  loadOml2dMock = vi.fn(() => ({}))
})

afterEach(() => {
  loadOml2dMock.mockClear()
  cleanup()
})

describe('Live2D (legacy integration)', () => {
  it('在允许展示的路径加载实例并渲染容器', async () => {
    const utils = render(
      <MemoryRouter initialEntries={['/archives']}>
        <Routes>
          <Route path="/archives" element={<Live2D />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(loadOml2dMock).toHaveBeenCalledTimes(1)
    })

    const container = utils.container.querySelector('.legacy-live2d-container')
    expect(container).not.toBeNull()
  })

  it('在非主页路由不加载实例', async () => {
    const utils = render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<Live2D />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(loadOml2dMock).not.toHaveBeenCalled()
    })

    const container = utils.container.querySelector('.legacy-live2d-container')
    expect(container).toBeNull()
  })
})
