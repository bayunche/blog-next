/**
 * Web 前台布局组件
 * 包含头部导航、主内容区、页脚
 */

import { Outlet, useLocation } from 'react-router-dom'
import { WebHeader } from './components'
import './WebLayout.less'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { RopeToTop, MusicPlayer, Live2D } from '@shared/components'
import {
  GithubOutlined,
  TwitterOutlined,
  SendOutlined,
  YoutubeOutlined,
} from '@ant-design/icons'

/**
 * Web 布局组件
 */
export function WebLayout() {
  const location = useLocation()
  const { t } = useTranslation('layout')

  const hideHeader = location.pathname === '/'
  const year = new Date().getFullYear()

  const socialLinks = [
    { key: 'github', icon: <GithubOutlined />, href: 'https://github.com/bayunche', label: 'GitHub' },
    { key: 'twitter', icon: <TwitterOutlined />, href: 'https://twitter.com/bayunche', label: 'Twitter' },
    { key: 'telegram', icon: <SendOutlined />, href: 'https://t.me/bayunche', label: 'Telegram' },
    { key: 'bilibili', icon: <YoutubeOutlined />, href: 'https://space.bilibili.com/2267573', label: 'Bilibili' },
  ]

  return (
    <div className="web-layout">
      <div className="web-layout__background" aria-hidden="true" />

      {/* 头部导航（从内容层抽离到最外层） */}
      {!hideHeader && (
        <div className="web-header">
          <WebHeader />
        </div>
      )}

      {/* 主内容区 */}
      <main className="web-content" role="main">
        <div className="content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="web-footer">
        <div className="web-footer__inner">
          <div className="web-footer__meta">
            <span>{t('footer.copyright', { year })}</span>
            <span>{t('footer.powered')}</span>
          </div>
          <div className="web-footer__social" aria-label="Footer social links">
            {socialLinks.map((item) => (
              <a key={item.key} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                {item.icon}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <>
        <RopeToTop />
        <Live2D />
        <MusicPlayer />
      </>
    </div>
  )
}

export default WebLayout
