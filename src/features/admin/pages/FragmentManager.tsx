/**
 * Admin fragment manager page
 */

import { useMemo, useState } from 'react'
import { Button, Input, Popconfirm, Space, Table, Tag } from 'antd'
import message from 'antd/es/message'
import type { TableColumnsType } from 'antd/es/table'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useDeleteFragmentMutation } from '../../hooks/useFragmentManage'
import { useFragmentList } from '@features/fragment'
import type { Fragment } from '@features/fragment/types'

const { Search } = Input

export function FragmentManager() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  const { data, isLoading, refetch, isFetching } = useFragmentList()
  const deleteMutation = useDeleteFragmentMutation({
    onSuccess: () => {
      message.success('\u5df2\u5220\u9664\u788e\u7247')
    },
    onError: err => {
      message.error(err.message ?? '\u64cd\u4f5c\u5931\u8d25')
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

  const columns: TableColumnsType<Fragment> = [
    {
      title: '\u7f16\u53f7',
      dataIndex: 'id',
      width: 100,
    },
    {
      title: '\u5185\u5bb9',
      dataIndex: 'content',
      ellipsis: true,
      render: (value: string) => value || '--',
    },
    {
      title: '\u4f5c\u8005',
      dataIndex: 'author',
      width: 140,
      render: (value: string | null | undefined) => value || '\u533f\u540d',
    },
    {
      title: '\u53d1\u5e03\u65f6\u95f4',
      dataIndex: 'createdAt',
      width: 200,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (value: string) => dayjs(value).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '\u64cd\u4f5c',
      dataIndex: 'id',
      width: 180,
      render: (id: number) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate('/admin/fragment/edit/${id}')}
          >
            \u7f16\u8f91
          </Button>
          <Popconfirm
            title="\u786e\u8ba4\u5220\u9664\u8be5\u788e\u7247\u5417\uff1f"
            okText="\u5220\u9664"
            cancelText="\u53d6\u6d88"
            icon={<DeleteOutlined style={{ color: 'var(--ant-error-color)' }} />}
            onConfirm={() => deleteMutation.mutate(id)}
          >
            <Button type="link" danger loading={deleteMutation.isPending}>
              \u5220\u9664
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
          placeholder="\u641c\u7d22\u788e\u7247\u5185\u5bb9"
          allowClear
          enterButton="\u641c\u7d22"
          onSearch={value => setKeyword(value)}
          style={{ maxWidth: 320 }}
        />
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()} loading={isFetching}>
            \u5237\u65b0
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/fragment/add')}
          >
            \u65b0\u5efa\u788e\u7247
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
        \u5f53\u524d\u5171 {filteredList.length}/{data?.total ?? 0} \u6761\u788e\u7247
      </Tag>
    </div>
  )
}

export default FragmentManager
