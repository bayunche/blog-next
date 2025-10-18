/**
 * “闲言”管理页面
 */

import { useMemo, useState } from 'react'
import { Button, Input, Popconfirm, Space, Table, Tag } from 'antd'
import message from 'antd/es/message'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useDeleteFragment, useFragmentList } from '@features/fragment'
import type { Fragment } from '@features/fragment/types'

const { Search } = Input

export function FragmentManager() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  const { data, isLoading, refetch, isFetching } = useFragmentList()
  const deleteMutation = useDeleteFragment({
    onSuccess: () => {
      message.success('已删除碎片')
      refetch()
    },
    onError: (err: Error) => {
      message.error(err.message ?? '操作失败')
    },
  })

  const fragments = useMemo(() => data?.list ?? [], [data])

  const filteredList = useMemo(() => {
    const lower = keyword.trim().toLowerCase()
    if (!lower) {
      return fragments
    }
    return fragments.filter(fragment => fragment.content.toLowerCase().includes(lower))
  }, [fragments, keyword])

  const columns: ColumnsType<Fragment> = [
    {
      title: '编号',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true,
      render: (value: string) => <div dangerouslySetInnerHTML={{ __html: value || '--' }} />,
    },
    {
      title: '作者',
      dataIndex: 'author',
      width: 140,
      render: (value: string | null | undefined) => value || '匿名',
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      width: 200,
      sorter: (a: Fragment, b: Fragment) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 180,
      render: (id: number) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/fragment/edit/${id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该碎片吗？"
            okText="删除"
            cancelText="取消"
            icon={<DeleteOutlined style={{ color: 'var(--ant-error-color)' }} />}
            onConfirm={() => deleteMutation.mutate(id)}
          >
            <Button type="link" danger loading={deleteMutation.isPending}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '1.5rem' }}>
      <Space style={{ marginBottom: '1rem', width: '100%', justifyContent: 'space-between' }}>
        <Search
          placeholder="搜索碎片内容"
          allowClear
          enterButton="搜索"
          onSearch={value => setKeyword(value)}
          style={{ maxWidth: 320 }}
        />
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isFetching}>
            刷新
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/fragment/add')}
          >
            新建碎片
          </Button>
        </Space>
      </Space>

      <Table<Fragment>
        rowKey="id"
        columns={columns}
        dataSource={filteredList}
        loading={isLoading}
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Tag color="blue" style={{ marginTop: '1rem' }}>
        当前共 {filteredList.length}/{data?.total ?? 0} 条碎片
      </Tag>
    </div>
  )
}

export default FragmentManager
