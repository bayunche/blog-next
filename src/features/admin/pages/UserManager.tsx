/**
 * 用户管理页面
 */

import { useState } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Modal,
  Switch,
  Avatar,
  type TableColumnsType,
} from 'antd'
import {
  UserOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CrownOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { useUserList, useUpdateUser, useDeleteUser } from '../hooks/useUserManage'
import type { UserItem } from '../api/user'

const { Search } = Input

/**
 * 用户管理页面组件
 */
export function UserManager() {
  // 筛选条件
  const [keyword, setKeyword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 数据加载
  const { data, isLoading } = useUserList({
    page,
    pageSize,
    keyword,
    role,
  })

  // 操作 Hooks
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  // 切换角色
  const handleRoleChange = (id: number, currentRole: 'user' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'

    Modal.confirm({
      title: '确认修改角色',
      icon: <ExclamationCircleOutlined />,
      content: `确定要将该用户设置为${newRole === 'admin' ? '管理员' : '普通用户'}吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        updateMutation.mutate({ id, data: { role: newRole } })
      },
    })
  }

  // 切换通知
  const handleNoticeChange = (id: number, checked: boolean) => {
    updateMutation.mutate({ id, data: { notice: checked } })
  }

  // 切换讨论权限
  const handleDiscussChange = (id: number, checked: boolean) => {
    updateMutation.mutate({ id, data: { disabledDiscuss: !checked } })
  }

  // 删除用户
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这个用户吗？删除后无法恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 表格列定义
  const columns: TableColumnsType<UserItem> = [
    {
      title: '用户',
      key: 'user',
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.username}</div>
            {record.email && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {record.email}
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string, record) => (
        <Tag
          color={role === 'admin' ? 'gold' : 'blue'}
          icon={role === 'admin' ? <CrownOutlined /> : <UserOutlined />}
          style={{ cursor: 'pointer' }}
          onClick={() => handleRoleChange(record.id, record.role)}
        >
          {role === 'admin' ? '管理员' : '用户'}
        </Tag>
      ),
    },
    {
      title: '邮件通知',
      dataIndex: 'notice',
      key: 'notice',
      width: 120,
      render: (notice: boolean, record) => (
        <Switch
          checked={notice}
          onChange={(checked) => handleNoticeChange(record.id, checked)}
        />
      ),
    },
    {
      title: '评论权限',
      dataIndex: 'disabledDiscuss',
      key: 'disabledDiscuss',
      width: 120,
      render: (disabledDiscuss: boolean, record) => (
        <Switch
          checked={!disabledDiscuss}
          onChange={(checked) => handleDiscussChange(record.id, checked)}
        />
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.id)}
        >
          删除
        </Button>
      ),
    },
  ]

  return (
    <div>
      {/* 筛选条件 */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="搜索用户名或邮箱"
          allowClear
          style={{ width: 300 }}
          onSearch={(value) => {
            setKeyword(value)
            setPage(1)
          }}
        />
        <Select
          placeholder="选择角色"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => {
            setRole(value)
            setPage(1)
          }}
          options={[
            { label: '管理员', value: 'admin' },
            { label: '普通用户', value: 'user' },
          ]}
        />
      </Space>

      {/* 用户列表 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data?.list}
        loading={isLoading}
        scroll={{ x: 900 }}
        pagination={{
          current: page,
          pageSize,
          total: data?.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个用户`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage)
            setPageSize(newPageSize)
          },
        }}
      />
    </div>
  )
}

export default UserManager
