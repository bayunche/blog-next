/**
 * Web 顶部导航组件
 */

import { useMemo, useState } from 'react'
import { Avatar, Button, Dropdown, Menu, Space, Select, type MenuProps } from 'antd'
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
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@shared/hooks'
import type { SupportedLanguage } from '@shared/i18n/locales'

type AuthTab = 'login' | 'register'

type MenuItem = Required<MenuProps>['items'][number]

const NAV_CONFIG = [
  {
    key: '/home',
    icon: <HomeOutlined />,
    labelKey: 'nav.home',
  },
  {
    key: '/archives',
    icon: <AppstoreOutlined />,
    labelKey: 'nav.archives',
  },
  {
    key: '/categories',
    icon: <AppstoreOutlined />,
    labelKey: 'nav.categories',
  },
  {
    key: '/tags',
    icon: <TagsOutlined />,
    labelKey: 'nav.tags',
  },
  {
    key: '/about',
    icon: <InfoCircleOutlined />,
    labelKey: 'nav.about',
  },
  {
    key: '/fragment',
    icon: <BulbOutlined />,
    labelKey: 'nav.fragment',
  },
]

/**
 * Web 顶部导航
 */
export function WebHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout, isLoggingOut } = useAuth()
  const { t: tLayout } = useTranslation('layout')
  const { t: tCommon } = useTranslation('common')
  const { language, supportedLanguages, setLanguage } = useLanguage()

  const [authModalVisible, setAuthModalVisible] = useState(false)
  const [authModalType, setAuthModalType] = useState<AuthTab>('login')

  const navMenuItems = useMemo<MenuProps['items']>(() => {
    return NAV_CONFIG.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: tLayout(item.labelKey),
    }))
  }, [tLayout])

  const userMenuItems = useMemo<MenuProps['items']>(() => {
    const items: MenuItem[] = [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: tLayout('nav.profile'),
        onClick: () => navigate('/profile'),
      },
    ]

    if (isAdmin) {
      items.push({ type: 'divider' })
      items.push({
        key: 'admin',
        icon: <DashboardOutlined />,
        label: tLayout('nav.admin'),
        onClick: () => navigate('/admin'),
      })
    }

    items.push({ type: 'divider' })
    items.push({
      key: 'logout',
      icon: <LogoutOutlined />,
      label: tLayout('nav.logout'),
      onClick: logout,
      disabled: isLoggingOut,
    })

    return items
  }, [isAdmin, isLoggingOut, logout, navigate, tLayout])

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
    const matched = NAV_CONFIG.find((item) => item.key === path)
    if (matched) {
      return [path]
    }
    const fuzzy = NAV_CONFIG.find((item) => path.startsWith(String(item.key)))
    return fuzzy && typeof fuzzy.key === 'string' ? [fuzzy.key] : []
  }, [location.pathname])

  return (
    <>
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          {tCommon('app.title')}
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={navMenuItems}
          onClick={handleMenuClick}
          style={{ flex: 1, minWidth: 0, borderBottom: 'none' }}
        />

        <Space size="middle">
          <Select
            value={language as SupportedLanguage}
            size="small"
            onChange={(value) => setLanguage(value as SupportedLanguage)}
            options={supportedLanguages.map((lng) => ({
              value: lng,
              label: tCommon(`languages.${lng}` as const),
            }))}
            style={{ width: 120 }}
          />

          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} size="small" />
                <span className="user-name">{user?.username || tCommon('user.visitor')}</span>
              </Space>
            </Dropdown>
          ) : (
            <Space>
              <Button type="text" icon={<LoginOutlined />} onClick={() => openAuthModal('login')}>
                {tLayout('nav.login')}
              </Button>
              <Button type="primary" onClick={() => openAuthModal('register')}>
                {tLayout('nav.register')}
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
