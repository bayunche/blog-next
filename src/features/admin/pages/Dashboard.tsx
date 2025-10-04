/**
 * 管理后台仪表盘页面
 */

import { Row, Col, Card, Statistic, Table, Typography, Space, Tag } from 'antd'
import {
  FileTextOutlined,
  UserOutlined,
  CommentOutlined,
  EyeOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

const { Title } = Typography

/**
 * 仪表盘页面组件
 */
export function Dashboard() {
  // 模拟统计数据（实际应该从 API 获取）
  const stats = {
    articleCount: 42,
    userCount: 128,
    commentCount: 356,
    viewCount: 15620,
  }

  // 模拟最新文章数据
  const recentArticles = [
    {
      key: '1',
      id: 1,
      title: 'React 19 新特性详解',
      createdAt: '2025-10-01 10:30:00',
      viewCount: 520,
      likeCount: 48,
      status: 'published',
    },
    {
      key: '2',
      id: 2,
      title: 'TypeScript 高级类型实战',
      createdAt: '2025-09-30 15:20:00',
      viewCount: 380,
      likeCount: 35,
      status: 'published',
    },
    {
      key: '3',
      id: 3,
      title: 'Vite 构建优化技巧',
      createdAt: '2025-09-29 09:15:00',
      viewCount: 290,
      likeCount: 28,
      status: 'published',
    },
    {
      key: '4',
      id: 4,
      title: 'TanStack Query 实战指南',
      createdAt: '2025-09-28 14:45:00',
      viewCount: 412,
      likeCount: 41,
      status: 'draft',
    },
    {
      key: '5',
      id: 5,
      title: 'Zustand 状态管理最佳实践',
      createdAt: '2025-09-27 11:30:00',
      viewCount: 356,
      likeCount: 32,
      status: 'published',
    },
  ]

  // 表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Link to={`/article/${record.id}`} target="_blank">
          {text}
        </Link>
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
      width: 100,
      sorter: (a: any, b: any) => a.viewCount - b.viewCount,
    },
    {
      title: '点赞',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 100,
      sorter: (a: any, b: any) => a.likeCount - b.likeCount,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
  ]

  return (
    <div>
      {/* 欢迎标题 */}
      <Title level={2} style={{ marginBottom: '24px' }}>
        欢迎回来，管理员！
      </Title>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
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
              suffix={
                <span style={{ fontSize: '14px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> 12%
                </span>
              }
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

      {/* 最新文章列表 */}
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
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 快捷操作提示 */}
      <Card
        title="快捷操作"
        style={{ marginTop: '24px' }}
      >
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
