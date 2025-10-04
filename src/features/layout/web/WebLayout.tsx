/**
 * Web 前台布局组件
 * 包含头部导航、主内容区、页脚
 */

import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import './WebLayout.less'

const { Header, Content, Footer } = Layout

/**
 * Web 布局组件
 */
export function WebLayout() {
  return (
    <Layout className="web-layout">
      {/* 头部导航 */}
      <Header className="web-header">
        <div className="header-content">
          <div className="logo">React Blog</div>
          {/* TODO: 添加导航菜单 */}
        </div>
      </Header>

      {/* 主内容区 */}
      <Content className="web-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </Content>

      {/* 页脚 */}
      <Footer className="web-footer">
        <div className="footer-content">
          React Blog ©{new Date().getFullYear()} Created with React 19 + Vite 7
        </div>
      </Footer>
    </Layout>
  )
}

export default WebLayout
