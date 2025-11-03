/**
 * 简化版 Live2D 组件
 * 基于旧项目实现：仅在首页相关路由加载 oh-my-live2d，并在离开时清理实例
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { loadOml2d } from 'oh-my-live2d'
import { useLocation } from 'react-router-dom'
import './styles.less'

type Live2DInstance = {
  clearTips?: () => void
  stopTipsIdle?: () => void
  statusBarClearEvents?: () => void
  stageSlideOut?: () => Promise<void> | void
  stageSlideIn?: () => Promise<void> | void
  startTipsIdle?: () => void
  setStageStyle?: (style: Record<string, unknown>) => void
  setModelScale?: (scale: number) => void
  setModelPosition?: (position: { x?: number; y?: number }) => void
  onStageSlideIn?: (handler: () => void) => void
  onLoad?: (handler: (status: string) => void) => void
  tipsMessage?: (message: string, duration?: number, priority?: number) => void
  statusBarPopup?: (message: string, duration?: number, color?: string) => void
}

const EXCLUDE_PATTERNS = [/^\/admin\b/]
const ROUTE_TIPS = [
  { pattern: /^\/$/, message: '欢迎回到首页，今天也要元气满满哦~' },
  { pattern: /^\/about/, message: '在关于页能了解到站长的故事，记得常来看看~' },
  { pattern: /^\/archives/, message: '归档区收藏着所有足迹，慢慢翻阅不会错过任何精彩~' },
  { pattern: /^\/categories/, message: '分类页让你快速找到目标主题，出发吧！' },
  { pattern: /^\/fragment|^\/fragments/, message: '碎碎念里充满灵感火花，别忘了留言互动~' },
  { pattern: /^\/tag/, message: '标签墙可以快速找到你喜欢的主题~' },
  { pattern: /^\/article/, message: '沉浸阅读时也要多做笔记，知识才能牢牢抓住~' },
]
const COPY_MESSAGES = [
  '复制成功！分享时也记得带上出处呀~',
  '笔记保存好了？希望它能帮到你！',
  '已复制，别忘了给作者点个赞支持一下~',
]

export function Live2D() {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<Live2DInstance | null>(null)
  const [canRender, setCanRender] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)

  const showTip = useCallback((message: string, duration = 4800, priority = 10) => {
    if (!message) return
    const instance = instanceRef.current
    instance?.tipsMessage?.(message, duration, priority)
  }, [])

  const showRouteTip = useCallback(
    (pathname: string) => {
      const entry = ROUTE_TIPS.find((item) => item.pattern.test(pathname))
      const message = entry?.message ?? '继续探索站点的每个角落，我都会陪着你~'
      showTip(message, 5200, 9)
    },
    [showTip],
  )

  const buildGreetingMessage = useCallback(() => {
    const hour = new Date().getHours()
    if (hour < 6) return '夜深啦，记得好好休息，别熬夜哦~'
    if (hour < 11) return '早安！新的一天从元气满满开始~'
    if (hour < 14) return '中午好，午饭后散散步更有灵感~'
    if (hour < 19) return '下午好，补充一点点甜份让效率 up up！'
    return '晚上好，忙碌了一天也要记得放松一下自己~'
  }, [])

  const applyResponsiveStage = useCallback((instance: Live2DInstance | null, attempt = 0) => {
    if (typeof window === 'undefined' || !instance) return
    const width = window.innerWidth
    let stageStyle = { width: 300, height: 400 }
    let scale = 0.2
    let position = { x: 30, y: 100 }

    if (width <= 992) {
      stageStyle = { width: 220, height: 280 }
      scale = 0.12
      position = { x: 0, y: 48 }
    } else if (width <= 1366) {
      stageStyle = { width: 260, height: 320 }
      scale = 0.13
      position = { x: 10, y: 54 }
    }

    const rawInstance = instance as Record<string, unknown>
    const models = rawInstance.models as { model?: unknown } | undefined
    if (!models?.model) {
      if (attempt < 5) {
        window.requestAnimationFrame(() => applyResponsiveStage(instance, attempt + 1))
      }
      return
    }

    instance.setStageStyle?.(stageStyle)
    instance.setModelScale?.(scale)
    instance.setModelPosition?.(position)
  }, [])

  useEffect(() => {
    const exclude = EXCLUDE_PATTERNS.some((pattern) => pattern.test(location.pathname))
    setCanRender(!exclude)
  }, [location.pathname])

  useEffect(() => {
    if (!canRender) {
      if (instanceRef.current) {
        instanceRef.current.clearTips?.()
        instanceRef.current.stopTipsIdle?.()
        instanceRef.current.statusBarClearEvents?.()
        instanceRef.current.stageSlideOut?.()
        instanceRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
      return
    }

    if (!containerRef.current || instanceRef.current) {
      return
    }

    const instance = loadOml2d({
      parentElement: containerRef.current,
      dockedPosition: 'right',
      mobileDisplay: false,
      primaryColor: '#ff69b4',
      sayHello: false,
      transitionTime: 800,
      models: [
        {
          path: 'https://cdn.jsdelivr.net/gh/bayunche/react-blog@release-v0.0.6/Resources/bilibili-22/index.json',
          position: [30, 100],
          scale: 0.2,
          stageStyle: { height: 400, width: 300 },
        },
        {
          path: 'https://cdn.jsdelivr.net/gh/bayunche/react-blog@release-v0.0.6/Resources/kobayaxi/model.json',
          position: [10, 110],
          scale: 0.2,
          stageStyle: { height: 400, width: 300 },
        },
        {
          path: 'https://cdn.jsdelivr.net/gh/bayunche/react-blog@release-v0.0.6/Resources/aqua/1014100aqua.model3.json',
          position: [10, 110],
          scale: 0.1,
        stageStyle: { height: 400, width: 300 },
      },
    ],
  }) as Live2DInstance

    instanceRef.current = instance
    applyResponsiveStage(instance)

    const handleResize = () => applyResponsiveStage(instanceRef.current)
    window.addEventListener('resize', handleResize)

    instance.onStageSlideIn?.(() => {
      applyResponsiveStage(instance)
      instance.startTipsIdle?.()
      showTip(buildGreetingMessage(), 5200, 12)
      showRouteTip(location.pathname)
    })

    instance.onLoad?.((status) => {
      if (status === 'success') {
        applyResponsiveStage(instance)
        showTip(buildGreetingMessage(), 5200, 12)
        showRouteTip(location.pathname)
      }
    })

    const copyHandler = () => {
      const message = COPY_MESSAGES[Math.floor(Math.random() * COPY_MESSAGES.length)]
      if (!instanceRef.current) return
      instanceRef.current.tipsMessage?.(message, 4800, 12)
      instanceRef.current.statusBarPopup?.('复制成功，欢迎常来一起玩~', 4000, '#ff69b4')
    }

    const visibilityHandler = () => {
      if (document.visibilityState === 'visible' && instanceRef.current) {
        instanceRef.current.tipsMessage?.('欢迎回来，我一直在这里等你呢~', 5000, 11)
      }
    }

    document.addEventListener('copy', copyHandler)
    document.addEventListener('visibilitychange', visibilityHandler)

    cleanupRef.current = () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('copy', copyHandler)
      document.removeEventListener('visibilitychange', visibilityHandler)
    }
  }, [applyResponsiveStage, buildGreetingMessage, canRender, location.pathname, showRouteTip, showTip])

  useEffect(
    () => () => {
      cleanupRef.current?.()
      cleanupRef.current = null
      if (instanceRef.current) {
        instanceRef.current.clearTips?.()
        instanceRef.current.stopTipsIdle?.()
        instanceRef.current.statusBarClearEvents?.()
        instanceRef.current.stageSlideOut?.()
        instanceRef.current = null
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    },
    [],
  )

  if (!canRender) {
    return null
  }

  return (
    <div className="legacy-live2d-wrapper">
      <div className="legacy-live2d-container" ref={containerRef} />
    </div>
  )
}

export default Live2D
