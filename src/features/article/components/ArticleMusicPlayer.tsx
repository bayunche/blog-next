import { useEffect, useMemo, useRef, useState } from 'react'
import type { ArticleMusic } from '../types'
import { useMetingReady } from '@shared/utils/meting'
import './ArticleMusicPlayer.less'

export interface ArticleMusicPlayerProps {
  music: ArticleMusic
  disableFloating?: boolean
}

function buildMetingAttributes(music: ArticleMusic) {
  return {
    server: music.server,
    type: music.type,
    id: music.id,
    autoplay: music.autoplay ? 'true' : 'false',
    mutex: 'true',
    'lrc-type': music.lrcType ? String(music.lrcType) : undefined,
  }
}

export function ArticleMusicPlayer({ music, disableFloating = false }: ArticleMusicPlayerProps) {
  const ready = useMetingReady()
  const attrs = useMemo(() => buildMetingAttributes(music), [music])
  const [key, setKey] = useState(() => `${music.server}-${music.type}-${music.id}`)
  const containerRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const [floating, setFloating] = useState(false)
  const [playerHeight, setPlayerHeight] = useState(0)
  const floatingEnabled = !disableFloating

  useEffect(() => {
    setKey(`${music.server}-${music.type}-${music.id}`)
  }, [music.server, music.type, music.id])

  useEffect(() => {
    if (!floatingEnabled || !ready) return
    const node = containerRef.current
    if (!node) return

    const updateHeight = () => {
      setPlayerHeight(node.offsetHeight)
    }

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateHeight)
      observer.observe(node)
      return () => observer.disconnect()
    }

    updateHeight()
    const timer = window.setInterval(updateHeight, 300)
    return () => window.clearInterval(timer)
  }, [floatingEnabled, ready, key])

  useEffect(() => {
    if (!floatingEnabled || !ready) return
    const sentinel = spacerRef.current
    if (!sentinel) return

    const handleScroll = () => {
      const rect = sentinel.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight
      const inView = rect.top < viewportHeight && rect.bottom > 0
      setFloating(!inView)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [floatingEnabled, ready, key])

  useEffect(() => {
    if (!floatingEnabled) return
    if (spacerRef.current) {
      spacerRef.current.style.height = floating ? `${playerHeight}px` : '0px'
    }
  }, [floatingEnabled, floating, playerHeight])

  if (!ready) {
    return null
  }

  return (
    <div className="article-music-player__outer">
      <div
        className={['article-music-player', floatingEnabled && floating ? 'is-floating' : '', disableFloating ? 'is-preview' : '']
          .filter(Boolean)
          .join(' ')}
        ref={containerRef}
      >
        <div className="article-music-info">
          <span className="label">文章配乐</span>
          <span className="value">{music.server} · {music.id}</span>
        </div>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meting-js key={key} {...attrs} />
      </div>
      {floatingEnabled && <div className="article-music-player__spacer" aria-hidden="true" ref={spacerRef} />}
    </div>
  )
}

export default ArticleMusicPlayer
