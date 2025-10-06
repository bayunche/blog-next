/* eslint-disable @typescript-eslint/no-namespace */
/**
 * 闂傚﹤鍘栫粻浼村箻椤撶喐鏉归柛锝冨妿缁秵绂?
 * 濞达綀娉曢弫?MetingJS 缂傚啯鍨跺Σ妤佺閹达妇鍙惧☉?API
 */

import { useEffect } from 'react'
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
  useEffect(() => {
    // 闁告柣鍔嶉埀顑跨婵偞娼?MetingJS 闁煎瓨纰嶅﹢?
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // 婵炴挸鎳愰幃濠囨嚇濮橆厽鎷?
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

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
