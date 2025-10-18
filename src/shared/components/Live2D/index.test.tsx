import { describe, expect, it, beforeAll, beforeEach, afterEach, vi } from 'vitest'
import { render, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Live2D } from './index'
import type { ReactNode } from 'react'

let stageSlideInMock: ReturnType<typeof vi.fn>
let stageSlideOutMock: ReturnType<typeof vi.fn>
let clearTipsMock: ReturnType<typeof vi.fn>
let stopTipsIdleMock: ReturnType<typeof vi.fn>
let startTipsIdleMock: ReturnType<typeof vi.fn>
let statusBarClearEventsMock: ReturnType<typeof vi.fn>
let tipsMessageMock: ReturnType<typeof vi.fn>
let statusBarPopupMock: ReturnType<typeof vi.fn>
let setStatusBarClickEventMock: ReturnType<typeof vi.fn>
let loadOml2dMock: ReturnType<typeof vi.fn>
let setStageStyleMock: ReturnType<typeof vi.fn>
let setModelScaleMock: ReturnType<typeof vi.fn>
let setModelPositionMock: ReturnType<typeof vi.fn>

vi.mock('oh-my-live2d', () => ({
  loadOml2d: (...args: unknown[]) => loadOml2dMock(...args),
}))

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  },
}))

const createMatchMedia = (matches = false) => ({
  matches,
  media: '',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => createMatchMedia(false)),
  })
})

beforeEach(() => {
  stageSlideInMock = vi.fn()
  stageSlideOutMock = vi.fn()
  clearTipsMock = vi.fn()
  stopTipsIdleMock = vi.fn()
  startTipsIdleMock = vi.fn()
  statusBarClearEventsMock = vi.fn()
  tipsMessageMock = vi.fn()
  statusBarPopupMock = vi.fn()
  setStatusBarClickEventMock = vi.fn()
  setStageStyleMock = vi.fn()
  setModelScaleMock = vi.fn()
  setModelPositionMock = vi.fn()
  loadOml2dMock = vi.fn(() => ({
    clearTips: clearTipsMock,
    stageSlideOut: stageSlideOutMock,
    stageSlideIn: stageSlideInMock,
    stopTipsIdle: stopTipsIdleMock,
    startTipsIdle: startTipsIdleMock,
    statusBarClearEvents: statusBarClearEventsMock,
    tipsMessage: tipsMessageMock,
    statusBarPopup: statusBarPopupMock,
    setStatusBarClickEvent: setStatusBarClickEventMock,
    setStageStyle: setStageStyleMock,
    setModelScale: setModelScaleMock,
    setModelPosition: setModelPositionMock,
    onStageSlideIn: (cb: () => void) => cb(),
    onLoad: (cb: (status: string) => void) => cb('success'),
  }))
})

afterEach(() => {
  loadOml2dMock.mockClear()
  stageSlideInMock.mockClear()
  stageSlideOutMock.mockClear()
  clearTipsMock.mockClear()
  stopTipsIdleMock.mockClear()
  statusBarClearEventsMock.mockClear()
  tipsMessageMock.mockClear()
  statusBarPopupMock.mockClear()
  setStatusBarClickEventMock.mockClear()
  setStageStyleMock.mockClear()
  setModelScaleMock.mockClear()
  setModelPositionMock.mockClear()
  cleanup()
})

describe('Live2D component', () => {
  it('在允许展示的路径渲染容器并触发模型加载', async () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route path="/home" element={<Live2D />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(loadOml2dMock).toHaveBeenCalledTimes(1)
    })

    expect(stageSlideInMock).toHaveBeenCalled()
    expect(startTipsIdleMock).toHaveBeenCalled()
    expect(tipsMessageMock).toHaveBeenCalledWith(
      expect.stringContaining('欢迎回到首页'),
      5200,
      9
    )

    expect(container.querySelector('.modern-live2d-container')).not.toBeNull()
  })

  it('在不允许的路径保持隐藏且不加载实例', async () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin" element={<Live2D />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(loadOml2dMock).not.toHaveBeenCalled()
    })
    expect(document.querySelector('.modern-live2d-container')).not.toBeNull()
  })

  it('卸载时清理实例资源', async () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route path="/home" element={<Live2D />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(loadOml2dMock).toHaveBeenCalledTimes(1)
    })

    unmount()

    await waitFor(() => {
      expect(stageSlideOutMock).toHaveBeenCalled()
      expect(clearTipsMock).toHaveBeenCalled()
      expect(stopTipsIdleMock).toHaveBeenCalled()
      expect(statusBarClearEventsMock).toHaveBeenCalled()
    })
  })
})
