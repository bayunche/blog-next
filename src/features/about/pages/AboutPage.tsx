/**
 * 关于页面
 * 展示博客介绍和个人信息
 */

import { Card, Typography, Divider, Row, Col, Avatar, Space, Tag } from 'antd'
import {
  GithubOutlined,
  MailOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  HeartOutlined,
  CodeOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

/**
 * 关于页面组件
 */
export function AboutPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* 个人简介卡片 */}
      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Avatar
            size={120}
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            style={{ marginBottom: '1rem' }}
          />
          <Title level={2} style={{ marginBottom: '0.5rem' }}>
            关于我
          </Title>
          <Text type="secondary">全栈开发者 / 技术博主</Text>
        </div>

        <Divider />

        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.8' }}>
          你好！欢迎来到我的个人博客。我是一名热爱编程的全栈开发者，
          专注于前端和后端技术的学习与实践。这个博客是我分享技术心得、
          记录学习历程的地方。
        </Paragraph>

        <Paragraph style={{ fontSize: '1rem', lineHeight: '1.8' }}>
          我喜欢探索新技术，解决有趣的问题，也乐于分享自己的经验。
          希望我的文章能够对你有所帮助！
        </Paragraph>
      </Card>

      {/* 技术栈 */}
      <Card title={<><CodeOutlined /> 技术栈</>} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Text strong>前端：</Text>
          <div style={{ marginTop: '0.5rem' }}>
            <Space wrap>
              <Tag color="blue">React</Tag>
              <Tag color="blue">TypeScript</Tag>
              <Tag color="blue">Vite</Tag>
              <Tag color="blue">Ant Design</Tag>
              <Tag color="blue">TanStack Query</Tag>
              <Tag color="blue">Zustand</Tag>
            </Space>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <Text strong>后端：</Text>
          <div style={{ marginTop: '0.5rem' }}>
            <Space wrap>
              <Tag color="green">Node.js</Tag>
              <Tag color="green">Koa</Tag>
              <Tag color="green">MySQL</Tag>
              <Tag color="green">Sequelize</Tag>
            </Space>
          </div>
        </div>

        <div>
          <Text strong>其他：</Text>
          <div style={{ marginTop: '0.5rem' }}>
            <Space wrap>
              <Tag color="orange">Git</Tag>
              <Tag color="orange">Docker</Tag>
              <Tag color="orange">Linux</Tag>
              <Tag color="orange">CI/CD</Tag>
            </Space>
          </div>
        </div>
      </Card>

      {/* 联系方式 */}
      <Card title={<><HeartOutlined /> 联系我</>}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space>
              <GithubOutlined style={{ fontSize: '1.2rem' }} />
              <Text>GitHub: </Text>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                @yourname
              </a>
            </Space>
          </Col>
          <Col span={24}>
            <Space>
              <MailOutlined style={{ fontSize: '1.2rem' }} />
              <Text>Email: </Text>
              <a href="mailto:your@email.com">your@email.com</a>
            </Space>
          </Col>
          <Col span={24}>
            <Space>
              <LinkOutlined style={{ fontSize: '1.2rem' }} />
              <Text>个人网站: </Text>
              <a
                href="https://yourwebsite.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                yourwebsite.com
              </a>
            </Space>
          </Col>
        </Row>

        <Divider />

        <Paragraph type="secondary" style={{ marginBottom: 0, textAlign: 'center' }}>
          欢迎通过以上方式与我交流！
        </Paragraph>
      </Card>
    </div>
  )
}

export default AboutPage
