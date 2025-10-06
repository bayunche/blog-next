/**
 * 后台碎片图表页面
 */

import { useMemo } from 'react'
import { Card, Col, Empty, List, Result, Row, Skeleton, Space, Statistic, Typography, Button } from 'antd'
import { Line } from '@ant-design/plots'
import dayjs from 'dayjs'
import { BulbOutlined, CalendarOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons'
import { useFragmentList } from '@features/fragment'

const { Title, Text } = Typography

interface ChartDatum {
  date: string
  count: number
}

export function FragmentAnalytics() {
  const { data, isLoading, isError, error, refetch, isFetching } = useFragmentList()

  const fragments = useMemo(() => data?.list ?? [], [data])

  const chartData: ChartDatum[] = useMemo(() => {
    const counter = new Map<string, number>()
    fragments.forEach((fragment) => {
      if (!fragment.createdAt) {
        return
      }
      const day = dayjs(fragment.createdAt).format('YYYY-MM-DD')
      if (!day || day === 'Invalid Date') {
        return
      }
      counter.set(day, (counter.get(day) ?? 0) + 1)
    })
    return Array.from(counter.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
  }, [fragments])

  const summary = useMemo(() => {
    const total = fragments.length
    const uniqueAuthors = new Set(
      fragments
        .map((fragment) => fragment.author?.trim())
        .filter((author): author is string => Boolean(author))
    ).size
    const firstDate = chartData[0]?.date
    const lastDate = chartData[chartData.length - 1]?.date
    const activeDays = chartData.length
    const averagePerDay = activeDays > 0 ? (total / activeDays).toFixed(1) : '0.0'
    return {
      total,
      uniqueAuthors,
      firstDate,
      lastDate,
      activeDays,
      averagePerDay,
    }
  }, [chartData, fragments])

  const recentFragments = useMemo(() => fragments.slice(0, 5), [fragments])

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  if (isError) {
    return (
      <Result
        status="error"
        title="碎片统计加载失败"
        subTitle={error?.message ?? '请稍后重试'}
        extra={
          <Button type="primary" icon={<ReloadOutlined />} onClick={() => refetch()} loading={isFetching}>
            重新加载
          </Button>
        }
      />
    )
  }

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <div>
        <Title level={2}>碎片趋势分析</Title>
        <Text type="secondary">根据碎片发布时间统计每日发布次数，用于观察活跃度变化。</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="碎片总数" value={summary.total} prefix={<BulbOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="活跃作者数" value={summary.uniqueAuthors} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="活跃天数" value={summary.activeDays} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="平均每日发布" value={Number(summary.averagePerDay)} precision={1} suffix="条" />
          </Card>
        </Col>
      </Row>

      <Card title="每日发布趋势" styles={{ body: { minHeight: 360 } }}>
        {chartData.length > 0 ? (
          <Line
            data={chartData}
            xField="date"
            yField="count"
            smooth
            point={{ size: 4, shape: 'diamond' }}
            tooltip={{ showMarkers: true }}
            animation={{ appear: { animation: 'path-in', duration: 800 } }}
            xAxis={{ title: { text: '日期' } }}
            yAxis={{ title: { text: '发布数量' }, tickInterval: 1 }}
            autoFit
          />
        ) : (
          <Empty description="暂无可视化数据" />
        )}
      </Card>

      <Card title="最新碎片">
        {recentFragments.length > 0 ? (
          <List
            dataSource={recentFragments}
            renderItem={(fragment) => (
              <List.Item key={fragment.id}>
                <List.Item.Meta
                  title={
                    <Space split={<Text type="secondary">•</Text>}>
                      <Text>{dayjs(fragment.createdAt).format('YYYY-MM-DD HH:mm')}</Text>
                      {fragment.author ? <Text type="secondary">{fragment.author}</Text> : null}
                    </Space>
                  }
                  description={<Text>{fragment.content}</Text>}
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无碎片记录" />
        )}
      </Card>
    </Space>
  )
}

export default FragmentAnalytics
