/**
 * 管理后台文章统计页面
 */

import { useMemo } from 'react'
import { Card, Col, Empty, List, Result, Row, Skeleton, Space, Statistic, Typography, Button, Tag } from 'antd'
import { Line } from '@ant-design/plots'
import {
  AreaChartOutlined,
  CalendarOutlined,
  ClusterOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { useArticleAnalytics } from '../hooks'

const { Title, Text } = Typography

export function ArticleAnalytics() {
  const { data, isLoading, isError, error, refetch, isFetching } = useArticleAnalytics()

  const records = data?.records ?? []
  const summary = data?.summary

  const dateRangeText = useMemo(() => {
    if (!summary?.startDate || !summary?.endDate) {
      return '暂无数据'
    }

    if (summary.startDate === summary.endDate) {
      return summary.startDate
    }

    return `${summary.startDate} ~ ${summary.endDate}`
  }, [summary?.startDate, summary?.endDate])

  const topArticles = summary?.topArticles ?? []

  if (isLoading) {
    return (
      <div data-testid="article-analytics-loading">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    )
  }

  if (isError) {
    return (
      <div data-testid="article-analytics-error">
        <Result
          status="error"
          title="文章统计数据加载失败"
          subTitle={error?.message ?? '请稍后重试'}
          extra={
            <Button type="primary" icon={<ReloadOutlined />} loading={isFetching} onClick={() => refetch()}>
              重新加载
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }} data-testid="article-analytics">
      <div>
        <Title level={2}>文章阅读趋势</Title>
        <Text type="secondary">按日聚合的阅读量走势，帮助识别文章热度与阶段性表现。</Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card data-testid="article-analytics-total">
            <Statistic title="总阅读量" value={summary?.totalReads ?? 0} prefix={<EyeOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card data-testid="article-analytics-unique">
            <Statistic title="活跃文章数" value={summary?.uniqueArticles ?? 0} prefix={<ClusterOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card data-testid="article-analytics-range">
            <Statistic
              title="统计区间"
              value={dateRangeText}
              prefix={<CalendarOutlined />}
              valueRender={() => <Text>{dateRangeText}</Text>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card data-testid="article-analytics-points">
            <Statistic title="数据点数" value={records.length} prefix={<AreaChartOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="文章阅读趋势" styles={{ body: { minHeight: 360 } }} data-testid="article-analytics-chart">
        {records.length > 0 ? (
          <Line
            data={records}
            xField="date"
            yField="count"
            seriesField="articleLabel"
            smooth
            point={{ size: 4, shape: 'circle' }}
            tooltip={{ showMarkers: true }}
            animation={{ appear: { animation: 'path-in', duration: 800 } }}
            xAxis={{ title: { text: '日期' } }}
            yAxis={{ title: { text: '阅读量' }, tickInterval: 1 }}
            legend={{ position: 'top' }}
            autoFit
          />
        ) : (
          <Empty description="暂无阅读记录" />
        )}
      </Card>

      <Card title="阅读量 Top 文章" styles={{ body: { minHeight: 240 } }} data-testid="article-analytics-top">
        {topArticles.length > 0 ? (
          <List
            dataSource={topArticles}
            renderItem={({ articleId, articleLabel, total }) => (
              <List.Item key={articleId}>
                <Space size="small">
                  <Tag color="blue">{articleLabel}</Tag>
                  <Text type="secondary">阅读量：{total}</Text>
                  <Button type="link" href={`/article/${articleId}`} target="_blank">
                    查看文章
                  </Button>
                </Space>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="暂无统计数据" />
        )}
      </Card>
    </Space>
  )
}

export default ArticleAnalytics
