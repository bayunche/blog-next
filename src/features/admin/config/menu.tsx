/**
 * 管理后台菜单配置
 */

import {
  HomeOutlined,
  EditOutlined,
  FolderOutlined,
  StarOutlined,
  AppstoreOutlined,
  FolderOpenOutlined,
  UserOutlined,
  MonitorOutlined,
  DotChartOutlined,
} from '@ant-design/icons'
import type { MenuItem } from '../types'

/**
 * 管理后台菜单列表
 */
export const adminMenuItems: MenuItem[] = [
  {
    path: '/admin',
    icon: <HomeOutlined />,
    name: '首页',
  },
  {
    path: '/admin/article',
    icon: <AppstoreOutlined />,
    name: '文章',
    children: [
      {
        path: '/admin/article/manager',
        icon: <FolderOutlined />,
        name: '管理',
      },
      {
        path: '/admin/article/add',
        icon: <EditOutlined />,
        name: '新增',
      },
      {
        path: '/admin/article/graph',
        icon: <StarOutlined />,
        name: '图表',
      },
    ],
  },
  {
    path: '/admin/fragment',
    icon: <FolderOpenOutlined />,
    name: '闲言',
    children: [
      {
        path: '/admin/fragment/manager',
        icon: <FolderOutlined />,
        name: '管理',
      },
      {
        path: '/admin/fragment/add',
        icon: <EditOutlined />,
        name: '新增',
      },
      {
        path: '/admin/fragment/graph',
        icon: <DotChartOutlined />,
        name: '图表',
      },
    ],
  },
  {
    path: '/admin/user',
    icon: <UserOutlined />,
    name: '用户管理',
  },
  {
    path: '/admin/monitor',
    icon: <MonitorOutlined />,
    name: '系统监控',
  },
]

/**
 * 获取菜单展开的key
 * 用于根据当前路径自动展开对应的子菜单
 */
export function getMenuOpenKeys(menu: MenuItem[]): Array<{ pathname: string; openKey: string }> {
  const list: Array<{ pathname: string; openKey: string }> = []

  menu.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => {
        list.push({
          pathname: child.path,
          openKey: item.path,
        })
      })
    }
  })

  return list
}
