/**
 * Live2D 看板娘组件
 * 基于 oh-my-live2d 库实现
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { loadOml2d } from 'oh-my-live2d'
import { useLocation } from 'react-router-dom'
import './styles.less'

const MOBILE_MEDIA_QUERY = '(max-width: 768px)'

const GREETINGS = [
  '欢迎来到我的博客~',
  '今天天气真不错呢~',
  '要不要看看最新的文章？',
  '和我聊聊你的想法吧~',
]

const getGreetingByTime = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深啦，记得好好休息，别熬夜哦~'
  if (hour < 11) return '早安！新的一天从元气满满开始~'
  if (hour < 14) return '中午好，午饭后散散步更有灵感~'
  if (hour < 19) return '下午好，补充一点点甜份让效率 up up！'
  return '晚上好，忙碌了一天也要记得放松一下自己~'
}

export function Live2D() {
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileView, setIsMobileView] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(MOBILE_MEDIA_QUERY).matches
  })

  const destroyInstance = useCallback(() => {
    const instance = instanceRef.current
    if (instance) {
      instance.clearTips?.()
      instance.stageSlideOut?.()
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
    }
    instanceRef.current = null
    setIsVisible(false)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia(MOBILE_MEDIA_QUERY)
    const handler = (event: MediaQueryListEvent) => setIsMobileView(event.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const allowDisplay =
      !isMobileView &&
      (location.pathname === '/' ||
        location.pathname.startsWith('/home') ||
        location.pathname.startsWith('/about') ||
        location.pathname.startsWith('/article'))

    if (allowDisplay && !instanceRef.current && containerRef.current) {
      setIsVisible(true)

      const instance = loadOml2d({
        parentElement: containerRef.current,
        dockedPosition: 'right',
        mobileDisplay: false,
        primaryColor: '#d67f47', // 暖橙色
        sayHello: false,
        transitionTime: 800,
        tips: {
          idleTips: {
            interval: 18000,
            message: GREETINGS,
          },
          welcomeTips: [getGreetingByTime()],
        },
        models: [
          {
            name: '萌萌哒看板娘',
            path: 'https://cdn.jsdelivr.net/gh/bayunche/react-blog@release-v0.0.6/Resources/bilibili-22/index.json',
            position: [0, 60],
            scale: 0.15,
            stageStyle: { height: 350, width: 280 },
          },
          {
            name: '可爱小姐姐',
            path: 'https://cdn.jsdelivr.net/gh/bayunche/react-blog@release-v0.0.6/Resources/kobayaxi/model.json',
            position: [0, 70],
            scale: 0.15,
            stageStyle: { height: 340, width: 280 },
          },
        ],
        statusBar: {
          enable: true,
          style: { right: '18px', bottom: '320px' },
        },
        menus: {
          disable: false,
          items: [
            {
              id: 'switch-model',
              icon: 'icon-switch',
              title: '切换模型',
              onClick: (oml2d: any) => oml2d.loadNextModel?.(),
            },
            {
              id: 'switch-texture',
              icon: 'icon-skin',
              title: '换个造型',
              onClick: (oml2d: any) => oml2d.loadNextModelClothes?.(),
            },
          ],
        },
      })

      instanceRef.current = instance
    } else if ((!allowDisplay || isMobileView) && instanceRef.current) {
      destroyInstance()
    }

    return () => {
      if (!allowDisplay && instanceRef.current) {
        destroyInstance()
      }
    }
  }, [destroyInstance, isMobileView, location.pathname])

  return isVisible ? (
    <div className="modern-live2d-wrapper">
      <div className="modern-live2d-container" ref={containerRef} />
    </div>
  ) : null
}

export default Live2D
