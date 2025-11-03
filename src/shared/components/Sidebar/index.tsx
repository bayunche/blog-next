/**
 * 侧边栏组件
 * 显示个人信息、热门文章、标签云、友情链接等
 */

import { Link } from 'react-router-dom'
import { Divider, Tag, Alert, Spin } from 'antd'
import { SIDEBAR_CONFIG, ANNOUNCEMENT_CONFIG } from '@shared/constants/blog.config'
import { useArticleList, useTags } from '@features/article/hooks'
import './styles.less'

/**
 * 侧边栏组件
 */
export function Sidebar() {
  // 获取热门文章（按浏览量排序，前6篇）
  const { data: hotArticles, isLoading: isLoadingHot } = useArticleList({
    params: {
      page: 1,
      pageSize: 6,
      orderBy: 'viewCount',
      order: 'DESC',
    },
  })

  // 获取标签列表
  const { data: tags, isLoading: isLoadingTags } = useTags()

  return (
    <aside className="app-sidebar">
      {/* 个人信息 */}
      <div className="sidebar-profile">
        <img src={SIDEBAR_CONFIG.avatar} className="sidebar-avatar" alt="avatar" />
        <h2 className="sidebar-title">{SIDEBAR_CONFIG.title}</h2>
        <p className="sidebar-subtitle">{SIDEBAR_CONFIG.subTitle}</p>
      </div>

      {/* 个人主页链接 */}
      <ul className="sidebar-links">
        {Object.entries(SIDEBAR_CONFIG.homepages).map(([name, { link, icon: Icon }]) => (
          <li key={name}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <Icon style={{ marginRight: 8 }} />
              {name}
            </a>
          </li>
        ))}
      </ul>

      {/* 公告 */}
      {ANNOUNCEMENT_CONFIG.enable && (
        <Alert
          message={ANNOUNCEMENT_CONFIG.content}
          type="info"
          style={{ marginBottom: '1rem' }}
        />
      )}

      {/* 热门文章 */}
      <Divider orientation="left">热门文章</Divider>
      {isLoadingHot ? (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <Spin size="small" />
        </div>
      ) : (
        <ul className="sidebar-article-list">
          {hotArticles?.list.map((article) => {
            const href = article.slug ? `/posts/${article.slug}` : `/article/${article.id}`
            return (
              <li key={article.id}>
                <Link to={href}>{article.title}</Link>
              </li>
            )
          })}
        </ul>
      )}

      {/* 标签云 */}
      <Divider orientation="left">标签</Divider>
      {isLoadingTags ? (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <Spin size="small" />
        </div>
      ) : (
        <div className="sidebar-tags">
          {tags?.map((tag) => (
            <Tag key={tag.id} color="blue">
              <Link to={`/tag/${tag.name}`}>{tag.name}</Link>
            </Tag>
          ))}
        </div>
      )}

      {/* 友情链接 */}
      {Object.keys(SIDEBAR_CONFIG.friendsLinks).length > 0 && (
        <>
          <Divider orientation="left">友情链接</Divider>
          <ul className="sidebar-friends">
            {Object.entries(SIDEBAR_CONFIG.friendsLinks).map(([name, { link, avatar }]) => (
              <li key={name}>
                {avatar && <img src={avatar} alt={name} className="friend-avatar" />}
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}

export default Sidebar
