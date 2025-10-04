/**
 * 管理后台头部导航
 */

import { Dropdown, type MenuProps } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@shared/stores'

/**
 * 管理后台头部组件
 */
export function AdminHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const menuItems: MenuProps['items'] = [
    {
      key: 'home',
      label: '返回主页',
      onClick: () => navigate('/home'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: '退出登录',
      danger: true,
      onClick: () => {
        logout()
        navigate('/')
      },
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        padding: '0 24px',
      }}
    >
      {/* 左侧标题 */}
      <div
        style={{
          fontSize: '20px',
          fontWeight: 600,
          color: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/admin')}
      >
        React-Blog Manager
      </div>

      {/* 右侧用户菜单 */}
      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <a
          style={{
            color: '#fff',
            fontSize: '14px',
          }}
          onClick={(e) => e.preventDefault()}
        >
          {user?.username || '管理员'} <DownOutlined />
        </a>
      </Dropdown>
    </div>
  )
}

export default AdminHeader
