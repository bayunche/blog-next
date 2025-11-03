/* eslint-disable @typescript-eslint/no-namespace */
/**
 * 闂傚﹤鍘栫粻浼村箻椤撶喐鏉归柛锝冨妿缁秵绂?
 * 濞达綀娉曢弫?MetingJS 缂傚啯鍨跺Σ妤佺閹达妇鍙惧☉?API
 */

import { useEffect, useState } from 'react'
import { loadMetingAssets } from '@shared/utils/meting'
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
    if (typeof window === 'undefined') return
    if ((window as any).Meting) {
      setIsReady(true)
      return
    }
    loadMetingAssets(() => setIsReady(true))
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
      api="https://netease.hasunemiku.top/api?server=:server&type=:type&id=:id&r=:r"
    />
  )
}

export default MusicPlayer
