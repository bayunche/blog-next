/**
 * 快速导航组件
 * 在大屏幕上显示为固定右侧导航，在小屏幕上显示为抽屉
 */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Drawer } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { QUICK_NAV_CONFIG } from '@shared/constants/blog.config'
import type { ArticleListItem } from '@features/article/types'
import './styles.less'

export interface QuickNavProps {
  /** 文章列表 */
  articles: ArticleListItem[]
}

/**
 * 快速导航组件
 */
export function QuickNav({ articles }: QuickNavProps) {
  const [drawerVisible, setDrawerVisible] = useState(false)

  if (!QUICK_NAV_CONFIG.enable) {
    return null
  }

  // 限制显示数量
  const displayArticles = articles.slice(0, QUICK_NAV_CONFIG.maxItems)

  // 文章列表内容
  const ArticleList = ({ showTitle = true }: { showTitle?: boolean }) => (
    <div className="quick-nav-list">
      {showTitle && <Divider>{QUICK_NAV_CONFIG.title}</Divider>}
      <ul>
        {displayArticles.map((article) => {
          const href = article.slug ? `/posts/${article.slug}` : `/article/${article.id}`
          return (
            <li key={article.id}>
              <Link to={href} onClick={() => setDrawerVisible(false)}>
                {article.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return (
    <>
      {/* 大屏幕：固定右侧导航 */}
      <div className="quick-nav-desktop">
        <ArticleList />
      </div>

      {/* 小屏幕：抽屉按钮 */}
      <div className="quick-nav-mobile-btn" onClick={() => setDrawerVisible(true)}>
        <MenuOutlined />
      </div>

      {/* 小屏幕：抽屉 */}
      <Drawer
        title={QUICK_NAV_CONFIG.title}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="quick-nav-drawer"
      >
        <ArticleList showTitle={false} />
      </Drawer>
    </>
  )
}

export default QuickNav
