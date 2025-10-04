/**
 * 系统监控页面
 */

import { Row, Col, Card, Statistic, Table, Progress, Space, Tag } from 'antd'
import {
  DashboardOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  DatabaseOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'

/**
 * 系统监控页面组件
 */
export function Monitor() {
  // 模拟系统性能数据
  const performanceData = {
    cpu: 45,
    memory: 62,
    disk: 38,
    network: 28,
  }

  // 模拟 API 响应时间数据
  const apiData = [
    {
      key: '1',
      endpoint: 'GET /api/article/list',
      avgTime: 125,
      maxTime: 380,
      minTime: 65,
      count: 1543,
      status: 'success',
    },
    {
      key: '2',
      endpoint: 'GET /api/article/:id',
      avgTime: 95,
      maxTime: 245,
      minTime: 45,
      count: 892,
      status: 'success',
    },
    {
      key: '3',
      endpoint: 'POST /api/discuss',
      avgTime: 168,
      maxTime: 512,
      minTime: 82,
      count: 634,
      status: 'success',
    },
    {
      key: '4',
      endpoint: 'GET /api/tag/list',
      avgTime: 58,
      maxTime: 156,
      minTime: 32,
      count: 2156,
      status: 'success',
    },
    {
      key: '5',
      endpoint: 'GET /api/category/list',
      avgTime: 62,
      maxTime: 178,
      minTime: 28,
      count: 1876,
      status: 'success',
    },
  ]

  // 模拟访问统计数据
  const accessData = [
    {
      key: '1',
      path: '/home',
      pv: 15620,
      uv: 8453,
      avgTime: '2m 34s',
    },
    {
      key: '2',
      path: '/article/:id',
      pv: 12340,
      uv: 7821,
      avgTime: '5m 12s',
    },
    {
      key: '3',
      path: '/categories',
      pv: 3456,
      uv: 2134,
      avgTime: '1m 45s',
    },
    {
      key: '4',
      path: '/tags',
      pv: 2987,
      uv: 1876,
      avgTime: '1m 28s',
    },
    {
      key: '5',
      path: '/archives',
      pv: 2543,
      uv: 1654,
      avgTime: '2m 03s',
    },
  ]

  // API 表格列
  const apiColumns = [
    {
      title: '接口',
      dataIndex: 'endpoint',
      key: 'endpoint',
      width: 300,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag
          icon={
            status === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />
          }
          color={status === 'success' ? 'success' : 'error'}
        >
          {status === 'success' ? '正常' : '异常'}
        </Tag>
      ),
    },
    {
      title: '平均响应时间',
      dataIndex: 'avgTime',
      key: 'avgTime',
      width: 150,
      render: (time: number) => `${time}ms`,
      sorter: (a: any, b: any) => a.avgTime - b.avgTime,
    },
    {
      title: '最大响应时间',
      dataIndex: 'maxTime',
      key: 'maxTime',
      width: 150,
      render: (time: number) => `${time}ms`,
    },
    {
      title: '最小响应时间',
      dataIndex: 'minTime',
      key: 'minTime',
      width: 150,
      render: (time: number) => `${time}ms`,
    },
    {
      title: '请求次数',
      dataIndex: 'count',
      key: 'count',
      width: 120,
      sorter: (a: any, b: any) => a.count - b.count,
    },
  ]

  // 访问统计表格列
  const accessColumns = [
    {
      title: '页面路径',
      dataIndex: 'path',
      key: 'path',
      width: 200,
    },
    {
      title: 'PV（页面浏览量）',
      dataIndex: 'pv',
      key: 'pv',
      width: 150,
      sorter: (a: any, b: any) => a.pv - b.pv,
    },
    {
      title: 'UV（独立访客）',
      dataIndex: 'uv',
      key: 'uv',
      width: 150,
      sorter: (a: any, b: any) => a.uv - b.uv,
    },
    {
      title: '平均停留时间',
      dataIndex: 'avgTime',
      key: 'avgTime',
      width: 150,
    },
  ]

  return (
    <div>
      {/* 系统性能 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <DashboardOutlined />
                系统性能
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="CPU 使用率"
                    value={performanceData.cpu}
                    suffix="%"
                    valueStyle={{
                      color: performanceData.cpu > 80 ? '#cf1322' : '#3f8600',
                    }}
                  />
                  <Progress
                    percent={performanceData.cpu}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="内存使用率"
                    value={performanceData.memory}
                    suffix="%"
                    valueStyle={{
                      color: performanceData.memory > 80 ? '#cf1322' : '#3f8600',
                    }}
                  />
                  <Progress
                    percent={performanceData.memory}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="磁盘使用率"
                    value={performanceData.disk}
                    suffix="%"
                    valueStyle={{
                      color: performanceData.disk > 80 ? '#cf1322' : '#3f8600',
                    }}
                  />
                  <Progress
                    percent={performanceData.disk}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card>
                  <Statistic
                    title="网络使用率"
                    value={performanceData.network}
                    suffix="%"
                    valueStyle={{
                      color: performanceData.network > 80 ? '#cf1322' : '#3f8600',
                    }}
                  />
                  <Progress
                    percent={performanceData.network}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* API 响应时间 */}
      <Card
        title={
          <Space>
            <ApiOutlined />
            API 响应时间
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={apiColumns}
          dataSource={apiData}
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 访问统计 */}
      <Card
        title={
          <Space>
            <ClockCircleOutlined />
            访问统计
          </Space>
        }
      >
        <Table
          columns={accessColumns}
          dataSource={accessData}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  )
}

export default Monitor
