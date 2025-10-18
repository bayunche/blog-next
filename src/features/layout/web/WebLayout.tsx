/**
 * Web 前台布局组件
 * 包含头部导航、主内容区、页脚
 */

import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import { WebHeader } from './components'
import './WebLayout.less'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { RopeToTop, MusicPlayer, Live2D } from '@shared/components'

const { Header, Content, Footer } = Layout

/**
 * Web 布局组件
 */
export function WebLayout() {
  const location = useLocation()
  const { t } = useTranslation('layout')

  return (
    <Layout className="web-layout">
      <div className="web-layout__background" aria-hidden="true" />
      {/* 头部导航 */}
      <Header className="web-header">
        <WebHeader />
      </Header>

      {/* 主内容区 */}
      <Content className="web-content">
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
      </Content>

      {/* 页脚 */}
      <Footer className="web-footer">
        <div className="footer-content">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </div>
      </Footer>

      <RopeToTop />
      <Live2D />
      <MusicPlayer />
    </Layout>
  )
}

export default WebLayout
