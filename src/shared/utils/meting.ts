import { useEffect, useRef, useState } from 'react'

export const METING_SCRIPT_ATTR = 'data-meting-script'

function ensureLink(href: string, attr: string) {
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

function ensureScript(src: string, attr: string) {
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

export function loadMetingAssets(onReady: () => void) {
  ensureLink('https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css', 'data-aplayer-css')
  ensureScript('https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js', 'data-aplayer-script')
  const metingScript = ensureScript('https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js', METING_SCRIPT_ATTR)

  if ((window as any).Meting) {
    onReady()
    return
  }

  const handler = () => {
    onReady()
  }

  metingScript.addEventListener('load', handler, { once: true })
}

export function useMetingReady() {
  const [ready, setReady] = useState(false)
  const calledRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if ((window as any).Meting) {
      setReady(true)
      return
    }
    if (calledRef.current) return
    calledRef.current = true
    loadMetingAssets(() => setReady(true))
  }, [])

  return ready
}
