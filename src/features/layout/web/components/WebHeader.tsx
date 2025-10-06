/**
 * Web 顶部导航组件
 */

import { useMemo, useState } from 'react'
import { Avatar, Button, Dropdown, Menu, Space, type MenuProps } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AppstoreOutlined,
  BulbOutlined,
  DashboardOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useAuth } from '@features/auth/hooks'
import { AuthModal } from '@features/auth/components'

type AuthTab = 'login' | 'register'

type MenuItem = Required<MenuProps>['items'][number]

const NAV_ITEMS: MenuItem[] = [
  {
    key: '/home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: '/archives',
    icon: <AppstoreOutlined />,
    label: '归档',
  },
  {
    key: '/categories',
    icon: <AppstoreOutlined />,
    label: '分类',
  },
  {
    key: '/tags',
    icon: <TagsOutlined />,
    label: '标签',
  },
  {
    key: '/about',
    icon: <InfoCircleOutlined />,
    label: '关于',
  },
  {
    key: '/fragment',
    icon: <BulbOutlined />,
    label: '碎片',
  },
]

/**
 * Web 顶部导航
 */
export function WebHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout, isLoggingOut } = useAuth()

  const [authModalVisible, setAuthModalVisible] = useState(false)
  const [authModalType, setAuthModalType] = useState<AuthTab>('login')

  const navMenuItems = useMemo<MenuProps['items']>(() => NAV_ITEMS, [])

  const userMenuItems = useMemo<MenuProps['items']>(() => {
    const items: MenuItem[] = [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人中心',
        onClick: () => navigate('/profile'),
      },
    ]

    if (isAdmin) {
      items.push({ type: 'divider' })
      items.push({
        key: 'admin',
        icon: <DashboardOutlined />,
        label: '管理后台',
        onClick: () => navigate('/admin'),
      })
    }

    items.push({ type: 'divider' })
    items.push({
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: logout,
      disabled: isLoggingOut,
    })

    return items
  }, [isAdmin, isLoggingOut, logout, navigate])

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  }

  const openAuthModal = (tab: AuthTab) => {
    setAuthModalType(tab)
    setAuthModalVisible(true)
  }

  const closeAuthModal = () => {
    setAuthModalVisible(false)
  }

  const selectedKeys = useMemo(() => {
    const path = location.pathname
    const matched = NAV_ITEMS.find((item) => item?.key === path)
    if (matched) {
      return [path]
    }
    const fuzzy = NAV_ITEMS.find((item) => path.startsWith(String(item?.key)))
    return fuzzy && typeof fuzzy.key === 'string' ? [fuzzy.key] : []
  }, [location.pathname])

  return (
    <>
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          React Blog
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={navMenuItems}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0, borderBottom: 'none' }}
        />

        <Space size="middle">
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} size="small" />
                <span className="user-name">{user?.username || '访客'}</span>
              </Space>
            </Dropdown>
          ) : (
            <Space>
              <Button type="text" icon={<LoginOutlined />} onClick={() => openAuthModal('login')}>
                登录
              </Button>
              <Button type="primary" onClick={() => openAuthModal('register')}>
                注册
              </Button>
            </Space>
          )}
        </Space>
      </div>

      <AuthModal visible={authModalVisible} onClose={closeAuthModal} defaultTab={authModalType} />
    </>
  )
}

export default WebHeader
