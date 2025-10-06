/**
 * 碎片时间线页面
 */

import { useMemo } from 'react'
import { Alert, Card, Empty, Skeleton, Space, Tag, Timeline, Typography } from 'antd'
import { CalendarOutlined, CommentOutlined, HeartOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useFragmentList } from '../hooks'

const { Title, Text, Paragraph } = Typography

export function FragmentPage() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useFragmentList()

  const fragments = useMemo(() => data?.list ?? [], [data])

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    )
  }

  if (isError) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <Alert
          type="error"
          showIcon
          message="碎片加载失败"
          description={error?.message ?? '请稍后重试'}
          action={
            <Space>
              <a onClick={() => refetch()}>
                <ReloadOutlined /> 重试
              </a>
            </Space>
          }
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Title level={1}>碎片时光</Title>
        <Text type="secondary">记录生活点滴，分享技术心情</Text>
      </div>

      {fragments.length > 0 ? (
        <Timeline
          mode="left"
          items={fragments.map((fragment) => ({
            color: 'blue',
            children: (
              <Card
                key={fragment.id}
                hoverable
                styles={{ body: { padding: '1.5rem' } }}
                style={{ marginBottom: '1.5rem' }}
              >
                <Paragraph style={{ fontSize: '1rem', lineHeight: 1.8 }}>
                  {fragment.content}
                </Paragraph>

                {fragment.author ? (
                  <Text type="secondary" style={{ display: 'block', marginBottom: '0.75rem' }}>
                    来自：{fragment.author}
                  </Text>
                ) : null}

                <Space wrap style={{ marginBottom: '1rem' }}>
                  <Tag icon={<CalendarOutlined />} color="blue">
                    {dayjs(fragment.createdAt).format('YYYY-MM-DD HH:mm')}
                  </Tag>
                </Space>

                <Space size="large" style={{ color: 'var(--text-secondary)' }}>
                  <span>
                    <HeartOutlined /> --
                  </span>
                  <span>
                    <CommentOutlined /> --
                  </span>
                </Space>
              </Card>
            ),
          }))}
        />
      ) : (
        <Empty description="暂无碎片内容" style={{ marginTop: '4rem' }} />
      )}

      <Card
        style={{
          marginTop: '2rem',
          background: 'var(--bg-secondary)',
          textAlign: 'center',
        }}
      >
        <Text type="secondary">
          {isRefetching ? '正在刷新碎片列表...' : `共 ${data?.total ?? 0} 条碎片`}
        </Text>
      </Card>
    </div>
  )
}

export default FragmentPage
