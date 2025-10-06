/**
 * �鵵ҳ��
 * ��ʱ����չʾ��������
 */

import { Timeline, Spin, Alert, Typography, Space, Tag } from 'antd'
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useArchives } from '../hooks'

const { Title, Text } = Typography

/**
 * �鵵ҳ�����
 */
export function ArchivesPage() {
  const { data, isLoading, error } = useArchives()

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <Alert message="����ʧ��" description={error.message} type="error" showIcon />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div
        data-testid="archives-loading"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Spin size="large" tip="������..." />
      </div>
    )
  }

  const years = data?.years ?? []
  const totalArticles = data?.total ?? 0

  if (years.length === 0) {
    return (
      <div data-testid="archives-empty" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          ���޹鵵����
        </div>
      </div>
    )
  }

  return (
    <div data-testid="archives-content" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* ҳ����� */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <Title level={1}>
          <ClockCircleOutlined /> ���¹鵵
        </Title>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>�� {totalArticles} ƪ����</p>
      </div>

      {years.map((yearData) => (
        <div key={yearData.year} style={{ marginBottom: '3rem' }}>
          <div
            style={{
              marginBottom: '1.5rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid var(--border-color)',
            }}
          >
            <Title level={2} style={{ marginBottom: '0.25rem' }}>
              <CalendarOutlined /> {yearData.year}
            </Title>
            <Text type="secondary">�� {yearData.count} ƪ����</Text>
          </div>

          <Timeline
            items={yearData.months.map((monthData) => ({
              color: 'blue',
              children: (
                <div key={`${yearData.year}-${monthData.month}`}>
                  <Title level={4} style={{ marginTop: 0, marginBottom: '1rem' }}>
                    {String(monthData.month).padStart(2, '0')} ��
                    <Tag color="blue" style={{ marginLeft: '0.5rem' }}>
                      {monthData.count} ƪ
                    </Tag>
                  </Title>

                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {monthData.articles.map((article) => (
                      <div
                        key={article.id}
                        style={{
                          padding: '1rem',
                          background: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius-md)',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateX(8px)'
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateX(0)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        <Link
                          to={`/article/${article.id}`}
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                          }}
                        >
                          {article.title}
                        </Link>

                        <div
                          style={{
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                            {dayjs(article.createdAt).format('MM-DD')}
                          </Text>

                          {article.category && article.category.name && (
                            <Link to={`/categories/${article.category.name}`} style={{ textDecoration: 'none' }}>
                              <Tag color="orange">{article.category.name}</Tag>
                            </Link>
                          )}

                          {Array.isArray(article.tags) && article.tags.length > 0 && (
                            <>
                              {article.tags.slice(0, 3).map((tag) => (
                                <Link key={tag.id ?? tag.name} to={`/tags/${tag.name}`} style={{ textDecoration: 'none' }}>
                                  <Tag color="blue">{tag.name}</Tag>
                                </Link>
                              ))}
                            </>
                          )}

                          {typeof article.viewCount === 'number' && (
                            <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                              ??? {article.viewCount}
                            </Text>
                          )}

                          {typeof article.likeCount === 'number' && (
                            <Text type="secondary" style={{ fontSize: '0.875rem' }}>
                              ?? {article.likeCount}
                            </Text>
                          )}
                        </div>
                      </div>
                    ))}
                  </Space>
                </div>
              ),
            }))}
          />
        </div>
      ))}
    </div>
  )
}

export default ArchivesPage
