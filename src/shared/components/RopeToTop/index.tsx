/**
 * 拉绳式回到顶部组件
 * 在页面右下角展示一根可点击的绳索，点击后平滑滚动至顶部
 */

import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@shared/stores/appStore'
import './styles.less'

export function RopeToTop() {
  const { t } = useTranslation('layout')
  const showBackTop = useAppStore((state) => state.showBackTop)
  const setShowBackTop = useAppStore((state) => state.setShowBackTop)

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 320
      setShowBackTop(shouldShow)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setShowBackTop])

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div
      className={`rope-to-top ${showBackTop ? 'visible' : ''}`}
      onClick={handleClick}
      role="button"
      aria-label={t('backToTop')}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleClick()
        }
      }}
    >
      <div className="rope-line" aria-hidden="true" />
      <div className="rope-handle">
        <span>{t('backToTop')}</span>
      </div>
    </div>
  )
}

export default RopeToTop
