/* eslint-disable @typescript-eslint/no-namespace */
/**
 * 闂傚﹤鍘栫粻浼村箻椤撶喐鏉归柛锝冨妿缁秵绂?
 * 濞达綀娉曢弫?MetingJS 缂傚啯鍨跺Σ妤佺閹达妇鍙惧☉?API
 */

import { useEffect, useState } from 'react'
import './styles.css'

// 濠㈠湱澧楀Σ?MetingJS 闁汇劌瀚崣蹇曚沪閳ь剛鐚剧拠鑼偓?
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'meting-js': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        server?: string
        type?: string
        id?: string
        fixed?: string
        autoplay?: string
        loop?: string
        order?: string
        preload?: string
        'list-folded'?: string
        'lrc-type'?: string
        mutex?: string
      }
    }
  }
}

export function MusicPlayer() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const ensureLink = (href: string, attr: string) => {
      let link = document.querySelector<HTMLLinkElement>(`link[${attr}]`)
      if (!link) {
        link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.setAttribute(attr, 'true')
        document.head.appendChild(link)
      }
      return link
    }

    const ensureScript = (src: string, attr: string) => {
      let script = document.querySelector<HTMLScriptElement>(`script[${attr}]`)
      if (!script) {
        script = document.createElement('script')
        script.src = src
        script.async = true
        script.setAttribute(attr, 'true')
        document.body.appendChild(script)
      }
      return script
    }

    ensureLink(
      'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css',
      'data-aplayer-css'
    )
    ensureScript(
      'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js',
      'data-aplayer-script'
    )
    const metingScript = ensureScript(
      'https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js',
      'data-meting-script'
    )

    const handleReady = () => setIsReady(true)

    if ((window as any).Meting) {
      setIsReady(true)
    } else {
      metingScript.addEventListener('load', handleReady, { once: true })
    }

    return () => {
      metingScript.removeEventListener('load', handleReady)
    }
  }, [])

  if (!isReady) {
    return null
  }

  return (
    <meting-js
      server="netease"
      type="playlist"
      id="12243826930"
      fixed="true"
      autoplay="true"
      loop="all"
      order="random"
      preload="auto"
      list-folded="true"
      lrc-type="3"
      mutex="true"
    />
  )
}

export default MusicPlayer
