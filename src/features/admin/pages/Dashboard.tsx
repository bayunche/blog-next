/**
 * 管理后台仪表盘页面
 */
import { useMemo } from 'react'
import { Row, Col, Card, Statistic, Table, Typography, Space, Tag, Button, Result, Spin } from 'antd'
import {
  FileTextOutlined,
  UserOutlined,
  CommentOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useDashboardOverview } from '../hooks'
import type { RecentArticle } from '../types'

const { Title } = Typography

const STATUS_COLOR: Record<RecentArticle['status'], string> = {
  published: 'green',
  draft: 'orange',
}

export function Dashboard() {
  const { data, isLoading, isError, refetch, isFetching } = useDashboardOverview()

  const stats = data?.stats ?? { articleCount: 0, userCount: 0, commentCount: 0, viewCount: 0 }
  const recentArticles = data?.recentArticles ?? []

  const columns = useMemo(
    () => [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render: (text: string, record: RecentArticle) => (
          <Link to={`/article/${record.id}`} target="_blank" rel="noopener noreferrer">
            {text}
          </Link>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        render: (status: RecentArticle['status']) => (
          <Tag color={STATUS_COLOR[status]}>{status === 'published' ? '已发布' : '草稿'}</Tag>
        ),
      },
      {
        title: '浏览',
        dataIndex: 'viewCount',
        key: 'viewCount',
        width: 120,
        sorter: (a: RecentArticle, b: RecentArticle) => a.viewCount - b.viewCount,
      },
      {
        title: '点赞',
        dataIndex: 'likeCount',
        key: 'likeCount',
        width: 120,
        sorter: (a: RecentArticle, b: RecentArticle) => a.likeCount - b.likeCount,
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 200,
        render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      },
    ],
    [],
  )

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spin size="large" tip="仪表盘数据加载中..." />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <Result
        status="error"
        title="仪表盘数据加载失败"
        subTitle="请检查网络或后端服务后再试。"
        extra={
          <Button type="primary" onClick={() => refetch()}>
            重试
          </Button>
        }
      />
    )
  }

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>
        欢迎回来，管理员！
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="文章总数"
              value={stats.articleCount}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={stats.userCount}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="评论总数"
              value={stats.commentCount}
              prefix={<CommentOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="浏览总数"
              value={stats.viewCount}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <FileTextOutlined />
            最新文章
          </Space>
        }
        extra={<Link to="/admin/article/manager">查看全部</Link>}
      >
        <Table
          columns={columns}
          dataSource={recentArticles}
          rowKey={(record) => record.id}
          pagination={false}
          size="middle"
          loading={isFetching && !isLoading}
          locale={{ emptyText: '暂无文章' }}
        />
      </Card>

      <Card title="快捷操作" style={{ marginTop: 24 }}>
        <Space size="large">
          <Link to="/admin/article/add">
            <FileTextOutlined /> 新建文章
          </Link>
          <Link to="/admin/article/manager">
            <FileTextOutlined /> 文章管理
          </Link>
          <Link to="/admin/user">
            <UserOutlined /> 用户管理
          </Link>
          <Link to="/admin/monitor">
            <EyeOutlined /> 系统监控
          </Link>
        </Space>
      </Card>
    </div>
  )
}

export default Dashboard
