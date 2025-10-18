/**
 * Live2D 看板娘组件
 * 依据 oh-my-live2d 官方最佳实践实现单实例挂载
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadOml2d } from 'oh-my-live2d'
import { useLocation } from 'react-router-dom'
import './styles.less'

const MOBILE_MEDIA_QUERY = '(max-width: 768px)'

const ALLOW_PATTERNS = [
  /^\/$/,
  /^\/home/,
  /^\/about/,
  /^\/archives/,
  /^\/categories/,
  /^\/fragment/,
  /^\/tags/,
  /^\/article/,
  /^\/welcome/,
]

const ROUTE_TIPS = [
  { pattern: /^\/$/, message: '欢迎回到首页，今天也要元气满满哦~' },
  { pattern: /^\/home/, message: '欢迎回到首页，今天也要元气满满哦~' },
  { pattern: /^\/about/, message: '在关于页能了解到站长的故事，记得常来看看~' },
  { pattern: /^\/archives/, message: '归档区收藏着所有足迹，慢慢翻阅不会错过任何精彩~' },
  { pattern: /^\/categories/, message: '分类页让你快速找到目标主题，出发吧！' },
  { pattern: /^\/fragment/, message: '碎碎念里充满灵感火花，别忘了留言互动~' },
  { pattern: /^\/tags/, message: '标签墙可以快速找到你喜欢的主题~' },
  { pattern: /^\/article/, message: '沉浸阅读时也要多做笔记，知识才能牢牢抓住~' },
]

const GREETINGS = [
  '欢迎来到我的博客~',
  '今天天气真不错呢~',
  '要不要看看最新的文章？',
  '和我聊聊你的想法吧~',
]

const COPY_MESSAGES = [
  '复制成功！分享时也记得带上出处呀~',
  '笔记保存好了？希望它能帮到你！',
  '已复制，别忘了给作者点个赞支持一下~',
]

const STATUS_TEXT = {
  rest: '先去喝杯奶茶，稍后继续陪你~',
  switching: '少女换装中，请稍等~',
  loading: '努力加载中，请稍候~',
  success: '准备就绪啦，一起玩耍吧~',
  fail: '加载失败了，等我调整一下姿势~',
  reload: '加载失败了，点我再试试~',
}

type Live2DInstance = {
  clearTips?: () => void
  stopTipsIdle?: () => void
  startTipsIdle?: () => void
  statusBarClearEvents?: () => void
  stageSlideIn?: () => Promise<void> | void
  stageSlideOut?: () => Promise<void> | void
  loadNextModel?: () => void
  loadNextModelClothes?: () => void
  tipsMessage?: (message: string, duration?: number, priority?: number) => void
  statusBarPopup?: (message: string, duration?: number, color?: string) => void
  setStatusBarClickEvent?: (handler: () => void) => void
  onStageSlideIn?: (handler: () => void) => void
  onLoad?: (handler: (status: string) => void) => void
  setStageStyle?: (style: Record<string, unknown>) => void
  setModelScale?: (scale: number) => void
  setModelPosition?: (position: { x?: number; y?: number }) => void
}

const getGreetingByTime = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深啦，记得好好休息，别熬夜哦~'
  if (hour < 11) return '早安！新的一天从元气满满开始~'
  if (hour < 14) return '中午好，午饭后散散步更有灵感~'
  if (hour < 19) return '下午好，补充一点点甜份让效率 up up！'
  return '晚上好，忙碌了一天也要记得放松一下自己~'
}

const getResponsiveStage = (width: number) => {
  if (width <= 992) return { stage: { width: 220, height: 280 }, scale: 0.12, position: { y: 48 } }
  if (width <= 1366) return { stage: { width: 260, height: 320 }, scale: 0.13, position: { y: 54 } }
  return { stage: { width: 280, height: 350 }, scale: 0.15, position: { y: 60 } }
}

export function Live2D() {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const instanceRef = useRef<Live2DInstance | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const displayStateRef = useRef<'visible' | 'hidden'>('hidden')
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches
  })

  const allowPath = useMemo(
    () => ALLOW_PATTERNS.some((pattern) => pattern.test(location.pathname)),
    [location.pathname]
  )

  const shouldShow = allowPath && !isMobile

  const applyResponsiveStage = useCallback((instance: Live2DInstance | null) => {
    if (typeof window === 'undefined' || !instance) return
    const { stage, scale, position } = getResponsiveStage(window.innerWidth)
    instance.setStageStyle?.(stage)
    instance.setModelScale?.(scale)
    instance.setModelPosition?.(position)
  }, [])

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

  const destroyInstance = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
    const instance = instanceRef.current
    if (instance) {
      instance.clearTips?.()
      instance.stopTipsIdle?.()
      instance.statusBarClearEvents?.()
      instance.stageSlideOut?.()
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }
    instanceRef.current = null
    displayStateRef.current = 'hidden'
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia(MOBILE_MEDIA_QUERY)
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    setIsMobile(media.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!shouldShow || instanceRef.current || !containerRef.current) {
      return
    }

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('OML2D_STATUS')
    }

    const instance = loadOml2d({
      parentElement: containerRef.current,
      dockedPosition: 'right',
      mobileDisplay: false,
      initialStatus: 'active',
      primaryColor: '#d67f47',
      sayHello: false,
      transitionTime: 800,
      tips: {
        idleTips: {
          interval: 18000,
          message: GREETINGS,
          duration: 5200,
          priority: 5,
        },
        copyTips: {
          message: COPY_MESSAGES,
          duration: 4200,
          priority: 8,
        },
        welcomeTips: [getGreetingByTime()],
      },
      models: [
        {
          name: 'Bilibili 22',
          path: '/live2d/bilibili-22/index.json',
          position: [0, 60],
          scale: 0.15,
          stageStyle: { height: 350, width: 280 },
        },
        {
          name: 'Kobayaxi',
          path: '/live2d/kobayaxi/model.json',
          position: [0, 70],
          scale: 0.15,
          stageStyle: { height: 340, width: 280 },
        },
        {
          name: 'Aqua',
          path: '/live2d/aqua/1014100aqua.model3.json',
          position: [0, 68],
          scale: 0.14,
          stageStyle: { height: 340, width: 280 },
        },
      ],
      statusBar: {
        disable: false,
        restMessage: STATUS_TEXT.rest,
        restMessageDuration: 6000,
        switchingMessage: STATUS_TEXT.switching,
        loadingMessage: STATUS_TEXT.loading,
        loadSuccessMessage: STATUS_TEXT.success,
        loadFailMessage: STATUS_TEXT.fail,
        reloadMessage: STATUS_TEXT.reload,
        style: { right: '18px', bottom: '320px' },
      },
      menus: {
        disable: false,
        items: [
          {
            id: 'switch-model',
            icon: 'icon-switch',
            title: '切换模型',
            onClick: (oml2d: Live2DInstance) => oml2d.loadNextModel?.(),
          },
          {
            id: 'switch-texture',
            icon: 'icon-skin',
            title: '换个造型',
            onClick: (oml2d: Live2DInstance) => oml2d.loadNextModelClothes?.(),
          },
        ],
      },
    }) as Live2DInstance

    instanceRef.current = instance

    const handleResize = () => applyResponsiveStage(instanceRef.current)
    const handleCopy = () => {
      const message = COPY_MESSAGES[Math.floor(Math.random() * COPY_MESSAGES.length)]
      showTip(message, 4800, 12)
      instanceRef.current?.statusBarPopup?.('复制成功，欢迎常来一起玩~', 4000, '#ff69b4')
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('copy', handleCopy)

    instance.onStageSlideIn?.(() => {
      displayStateRef.current = 'visible'
      instance.startTipsIdle?.()
      applyResponsiveStage(instance)
    })

    instance.onLoad?.((status) => {
      if (status === 'success') {
        applyResponsiveStage(instance)
      }
    })

    instance.setStatusBarClickEvent?.(() => {
      if (typeof window !== 'undefined') {
        window.open('https://github.com', '_blank', 'noopener,noreferrer')
      }
    })

    instance.stageSlideIn?.()
    instance.startTipsIdle?.()
    applyResponsiveStage(instance)
    showTip(getGreetingByTime(), 5200, 12)
    showRouteTip(location.pathname)
    displayStateRef.current = 'visible'

    cleanupRef.current = () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('copy', handleCopy)
    }
  }, [applyResponsiveStage, location.pathname, shouldShow, showRouteTip, showTip])

  useEffect(() => {
    const instance = instanceRef.current
    if (!instance) return

    if (shouldShow) {
      if (displayStateRef.current !== 'visible') {
        displayStateRef.current = 'visible'
        instance.stageSlideIn?.()
        instance.startTipsIdle?.()
      }
      showRouteTip(location.pathname)
    } else if (displayStateRef.current !== 'hidden') {
      displayStateRef.current = 'hidden'
      instance.stopTipsIdle?.()
      instance.stageSlideOut?.()
    }
  }, [location.pathname, shouldShow, showRouteTip])

  useEffect(
    () => () => {
      destroyInstance()
    },
    [destroyInstance],
  )

  return (
    <div className="modern-live2d-wrapper">
      <div className="modern-live2d-container" ref={containerRef} />
    </div>
  )
}

export default Live2D
