/**
 * 文章管理页面
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
  message,
  type TableProps,
  type TableColumnsType,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  useArticleManageList,
  useDeleteArticle,
  useBatchDeleteArticles,
  usePublishArticle,
  useBatchPublishArticles,
  useUnpublishArticle,
} from '../hooks/useArticleManage'
import { useCategories, useTags } from '@features/article'
import type { ArticleManageItem } from '../api/article'

const { Search } = Input

/**
 * 文章管理页面组件
 */
export function ArticleManager() {
  const navigate = useNavigate()

  // 筛选条件
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState<number>()
  const [tagId, setTagId] = useState<number>()
  const [status, setStatus] = useState<'draft' | 'published'>()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 选中的文章
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  // 数据加载
  const { data, isLoading } = useArticleManageList({
    page,
    pageSize,
    keyword,
    categoryId,
    tagId,
    status,
  })

  const { data: categories } = useCategories()
  const { data: tags } = useTags()

  // 操作 Hooks
  const deleteMutation = useDeleteArticle()
  const batchDeleteMutation = useBatchDeleteArticles()
  const publishMutation = usePublishArticle()
  const batchPublishMutation = useBatchPublishArticles()
  const unpublishMutation = useUnpublishArticle()

  // 表格列定义
  const columns: TableColumnsType<ArticleManageItem> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record) => (
        <a
          onClick={() => navigate(`/admin/article/edit/${record.id}`)}
          style={{ color: 'var(--ant-color-primary)' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: any) =>
        category ? <Tag color="orange">{category.name}</Tag> : '-',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: any[]) =>
        tags && tags.length > 0 ? (
          <Space size="small">
            {tags.slice(0, 3).map((tag) => (
              <Tag key={tag.id} color="blue">
                {tag.name}
              </Tag>
            ))}
            {tags.length > 3 && <Tag>+{tags.length - 3}</Tag>}
          </Space>
        ) : (
          '-'
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
    },
    {
      title: '浏览',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      sorter: (a, b) => a.viewCount - b.viewCount,
    },
    {
      title: '点赞',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 80,
      sorter: (a, b) => a.likeCount - b.likeCount,
    },
    {
      title: '评论',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: 80,
      sorter: (a, b) => a.commentCount - b.commentCount,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/article/edit/${record.id}`)}
          >
            编辑
          </Button>
          {record.status === 'draft' ? (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handlePublish(record.id)}
            >
              发布
            </Button>
          ) : (
            <Button
              type="link"
              size="small"
              onClick={() => handleUnpublish(record.id)}
            >
              取消发布
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  // 删除文章
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这篇文章吗？删除后无法恢复。',
      okText: '确定',
      cancelText: '取消',
      onOk: () => deleteMutation.mutate(id),
    })
  }

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的文章')
      return
    }

    Modal.confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 篇文章吗？删除后无法恢复。`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        batchDeleteMutation.mutate(selectedRowKeys as number[], {
          onSuccess: () => setSelectedRowKeys([]),
        })
      },
    })
  }

  // 发布文章
  const handlePublish = (id: number) => {
    publishMutation.mutate(id)
  }

  // 取消发布
  const handleUnpublish = (id: number) => {
    unpublishMutation.mutate(id)
  }

  // 批量发布
  const handleBatchPublish = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要发布的文章')
      return
    }

    batchPublishMutation.mutate(selectedRowKeys as number[], {
      onSuccess: () => setSelectedRowKeys([]),
    })
  }

  // 行选择配置
  const rowSelection: TableProps<ArticleManageItem>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  }

  return (
    <div>
      {/* 筛选条件 */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="搜索文章标题"
          allowClear
          style={{ width: 300 }}
          onSearch={(value) => {
            setKeyword(value)
            setPage(1)
          }}
        />
        <Select
          placeholder="选择分类"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => {
            setCategoryId(value)
            setPage(1)
          }}
          options={categories?.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))}
        />
        <Select
          placeholder="选择标签"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => {
            setTagId(value)
            setPage(1)
          }}
          options={tags?.map((tag) => ({
            label: tag.name,
            value: tag.id,
          }))}
        />
        <Select
          placeholder="选择状态"
          allowClear
          style={{ width: 120 }}
          onChange={(value) => {
            setStatus(value)
            setPage(1)
          }}
          options={[
            { label: '草稿', value: 'draft' },
            { label: '已发布', value: 'published' },
          ]}
        />
      </Space>

      {/* 操作按钮 */}
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/article/add')}
        >
          新建文章
        </Button>
        <Button
          icon={<CheckCircleOutlined />}
          onClick={handleBatchPublish}
          disabled={selectedRowKeys.length === 0}
        >
          批量发布
        </Button>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleBatchDelete}
          disabled={selectedRowKeys.length === 0}
        >
          批量删除
        </Button>
      </Space>

      {/* 文章列表 */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data?.list}
        loading={isLoading}
        rowSelection={rowSelection}
        scroll={{ x: 1400 }}
        pagination={{
          current: page,
          pageSize,
          total: data?.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 篇文章`,
          onChange: (newPage, newPageSize) => {
            setPage(newPage)
            setPageSize(newPageSize)
          },
        }}
      />
    </div>
  )
}

export default ArticleManager
