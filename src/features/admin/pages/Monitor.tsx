/**
 * 系统监控页面
 * 结合 performanceStore 和 socket.io 数据展示运行指标。
 */
import { useMemo } from 'react'
import { Card, Col, Empty, Progress, Row, Space, Statistic, Table, Tag } from 'antd'
import {
  ApiOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { Area, Line } from '@ant-design/plots'
import dayjs from 'dayjs'
import { useSystemMonitor } from '../hooks/useSystemMonitor'
import { usePerformanceStore } from '@shared/stores/performanceStore'

type MetricRating = 'good' | 'needs-improvement' | 'poor'

function getRatingColor(rating: MetricRating) {
  switch (rating) {
    case 'good':
      return 'green'
    case 'needs-improvement':
      return 'gold'
    case 'poor':
    default:
      return 'red'
  }
}

export function Monitor() {
  const { isConnected } = useSystemMonitor()

  const systemPerformance = usePerformanceStore((state) => state.systemPerformance)
  const metrics = usePerformanceStore((state) => state.metrics)
  const fpsHistory = usePerformanceStore((state) => state.fpsHistory)
  const memoryUsage = usePerformanceStore((state) => state.memoryUsage)
  const navigationHistory = usePerformanceStore((state) => state.navigationHistory)

  const latestSystem =
    systemPerformance.length > 0 ? systemPerformance[systemPerformance.length - 1] : null
  const latestFps = fpsHistory.length > 0 ? fpsHistory[fpsHistory.length - 1].fps : null
  const cpuPercent = latestSystem ? Math.round(Math.min(1, Math.max(0, latestSystem.cpuUsage)) * 100) : null
  const memoryPercent = latestSystem
    ? Math.round(Math.min(1, Math.max(0, latestSystem.memoryUsage)) * 100)
    : null

  const systemTrend = useMemo(() => {
    return systemPerformance
      .map((item) => {
        const time = dayjs(item.timestamp).format('HH:mm:ss')
        return [
          {
            time,
            metric: 'CPU',
            value: Math.round(Math.min(1, Math.max(0, item.cpuUsage)) * 100),
          },
          {
            time,
            metric: '内存',
            value: Math.round(Math.min(1, Math.max(0, item.memoryUsage)) * 100),
          },
        ]
      })
      .flat()
      .slice(-120)
  }, [systemPerformance])

  const fpsTrend = useMemo(() => {
    return fpsHistory.map((record) => ({
      time: dayjs(record.timestamp).format('HH:mm:ss'),
      value: record.fps,
    }))
  }, [fpsHistory])

  const metricRows = useMemo(() => {
    return metrics.slice(0, 12).map((metric) => ({
      key: metric.timestamp,
      name: metric.name,
      value: metric.value.toFixed(2),
      delta: metric.delta ? metric.delta.toFixed(2) : '-',
      rating: metric.rating,
      recordedAt: dayjs(metric.timestamp).format('HH:mm:ss'),
    }))
  }, [metrics])

  const navigationRows = useMemo(() => {
    return navigationHistory.slice(0, 12).map((record, index) => ({
      key: `${record.path}-${record.timestamp}-${index}`,
      path: record.path,
      event: record.event,
      timestamp: dayjs(record.timestamp).format('HH:mm:ss'),
      duration: record.duration ? Math.round(record.duration / 1000) : null,
    }))
  }, [navigationHistory])

  const metricColumns = [
    {
      title: '指标',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      width: 120,
    },
    {
      title: '变化量',
      dataIndex: 'delta',
      key: 'delta',
      width: 120,
    },
    {
      title: '评级',
      dataIndex: 'rating',
      key: 'rating',
      width: 160,
      render: (rating: MetricRating) => (
        <Tag color={getRatingColor(rating)}>
          {rating === 'good' ? '优秀' : rating === 'needs-improvement' ? '需优化' : '较差'}
        </Tag>
      ),
    },
    {
      title: '采集时间',
      dataIndex: 'recordedAt',
      key: 'recordedAt',
      width: 150,
    },
  ]

  const navigationColumns = [
    {
      title: '页面路径',
      dataIndex: 'path',
      key: 'path',
      width: 220,
    },
    {
      title: '事件',
      dataIndex: 'event',
      key: 'event',
      width: 120,
      render: (event: 'enter' | 'leave') => (
        <Tag color={event === 'enter' ? 'blue' : 'purple'}>{event === 'enter' ? '进入' : '离开'}</Tag>
      ),
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160,
    },
    {
      title: '停留时长 (s)',
      dataIndex: 'duration',
      key: 'duration',
      width: 160,
      render: (value: number | null) => (value ?? '—'),
    },
  ]

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Space size="large">
              <Tag
                color={isConnected ? 'green' : 'red'}
                icon={isConnected ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              >
                {isConnected ? 'Socket 已连接' : 'Socket 未连接'}
              </Tag>
              <Tag color={metrics.length > 0 ? 'blue' : 'default'}>
                Web Vitals {metrics.length > 0 ? '采集中' : '等待数据'}
              </Tag>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="CPU 使用率"
              value={cpuPercent ?? 0}
              suffix="%"
              prefix={<DashboardOutlined />}
              valueStyle={{ color: cpuPercent && cpuPercent > 80 ? '#cf1322' : '#3f8600' }}
            />
            <Progress percent={cpuPercent ?? 0} status={cpuPercent && cpuPercent > 80 ? 'exception' : 'active'} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="内存使用率"
              value={memoryPercent ?? 0}
              suffix="%"
              prefix={<DashboardOutlined />}
              valueStyle={{ color: memoryPercent && memoryPercent > 80 ? '#cf1322' : '#3f8600' }}
            />
            <Progress percent={memoryPercent ?? 0} status={memoryPercent && memoryPercent > 80 ? 'exception' : 'active'} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="当前 FPS"
              value={latestFps ?? 0}
              suffix="fps"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: (latestFps ?? 0) < 30 ? '#cf1322' : '#3f8600' }}
            />
            <Progress
              percent={Math.min(100, Math.round(((latestFps ?? 0) / 60) * 100))}
              status={(latestFps ?? 0) < 30 ? 'exception' : 'active'}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="JS 内存使用" value={memoryUsage ? memoryUsage.used.toFixed(1) : '—'} suffix="MB" />
            <Statistic
              title="较上次变化"
              value={memoryUsage ? `${memoryUsage.increase >= 0 ? '+' : ''}${memoryUsage.increase.toFixed(1)} MB` : '—'}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title={<Space><DashboardOutlined />CPU / 内存趋势</Space>}>
            {systemTrend.length > 0 ? (
              <Line
                data={systemTrend}
                xField="time"
                yField="value"
                seriesField="metric"
                smooth
                yAxis={{ min: 0, max: 100, title: { text: '百分比 (%)' } }}
                tooltip={{ showMarkers: true }}
                animation={{ appear: { animation: 'path-in', duration: 600 } }}
              />
            ) : (
              <Empty description="暂无系统指标" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={<Space><ThunderboltOutlined />FPS 趋势</Space>}>
            {fpsTrend.length > 0 ? (
              <Area
                data={fpsTrend}
                xField="time"
                yField="value"
                smooth
                yAxis={{ min: 0, nice: true, title: { text: 'FPS' } }}
                tooltip={{ showMarkers: true }}
                animation={{ appear: { animation: 'path-in', duration: 600 } }}
              />
            ) : (
              <Empty description="暂无 FPS 数据" />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title={<Space><ApiOutlined />Web Vitals 指标</Space>}>
            <Table
              columns={metricColumns}
              dataSource={metricRows}
              size="small"
              pagination={false}
              locale={{ emptyText: '暂无性能指标' }}
              rowKey="key"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<Space><ClockCircleOutlined />页面导航记录</Space>}>
            <Table
              columns={navigationColumns}
              dataSource={navigationRows}
              size="small"
              pagination={false}
              locale={{ emptyText: '暂无导航数据' }}
              rowKey="key"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Monitor
