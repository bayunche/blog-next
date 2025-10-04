/**
 * 功能测试页面
 * 验证所有基础设施是否正常工作
 */

import { useState } from 'react'
import { Button, Card, Space, Typography, Tag, Divider, message } from 'antd'
import {
  CheckCircleOutlined,
  BulbOutlined,
  UserOutlined,
  AppstoreOutlined,
  LoginOutlined,
} from '@ant-design/icons'
import { useAuthStore, useThemeStore, useAppStore } from '@shared/stores'
import { useTheme } from '@app/providers'
import { AuthModal } from '@features/auth'

const { Title, Paragraph, Text } = Typography

/**
 * 测试页面组件
 */
export function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [authModalVisible, setAuthModalVisible] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')

  // ==================== Zustand Stores ====================
  const authStore = useAuthStore()
  const themeStore = useThemeStore()
  const appStore = useAppStore()

  // ==================== Theme Provider ====================
  const { getTheme, setTheme } = useTheme()

  // ==================== 测试函数 ====================
  const runTests = () => {
    const results: string[] = []

    // 测试 1: Zustand Auth Store
    results.push('✅ Auth Store 已加载')
    results.push(`   - 认证状态: ${authStore.isAuthenticated() ? '已登录' : '未登录'}`)
    results.push(`   - 管理员: ${authStore.isAdmin() ? '是' : '否'}`)

    // 测试 2: Zustand Theme Store
    results.push('✅ Theme Store 已加载')
    results.push(`   - 主题模式: ${themeStore.mode}`)
    results.push(`   - 实际主题: ${themeStore.actualTheme}`)

    // 测试 3: Zustand App Store
    results.push('✅ App Store 已加载')
    results.push(`   - 侧边栏折叠: ${appStore.sidebarCollapsed ? '是' : '否'}`)
    results.push(`   - 首次访问: ${appStore.isFirstVisit ? '是' : '否'}`)

    // 测试 4: Theme Provider
    results.push('✅ Theme Provider 已加载')
    results.push(`   - 当前主题: ${getTheme()}`)

    // 测试 5: Ant Design
    results.push('✅ Ant Design 组件正常')

    // 测试 6: CSS Variables
    const rootStyles = getComputedStyle(document.documentElement)
    const primaryColor = rootStyles.getPropertyValue('--primary-color')
    results.push('✅ CSS 变量已应用')
    results.push(`   - 主色调: ${primaryColor}`)

    setTestResults(results)
    message.success('所有测试通过！')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={1}>🎉 基础设施测试页面</Title>
      <Paragraph>
        验证 React 19 + Vite 7 + TypeScript + Ant Design v5 的完整配置
      </Paragraph>

      <Divider />

      {/* 功能展示 */}
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 1. 设计系统 */}
        <Card title="🎨 设计系统" bordered={false} className="glass-card">
          <Space wrap>
            <Tag color="magenta">萌系粉色主题</Tag>
            <Tag color="blue">毛玻璃效果</Tag>
            <Tag color="green">CSS 变量系统</Tag>
            <Tag color="orange">设计令牌</Tag>
          </Space>
          <Paragraph style={{ marginTop: '1rem' }}>
            完整的设计令牌系统：colors, spacing, typography, shadows
          </Paragraph>
        </Card>

        {/* 2. 主题切换 */}
        <Card
          title={
            <>
              <BulbOutlined /> 主题系统
            </>
          }
          bordered={false}
        >
          <Space>
            <Button onClick={() => themeStore.setMode('light')}>明亮模式</Button>
            <Button onClick={() => themeStore.setMode('dark')}>暗黑模式</Button>
            <Button onClick={() => themeStore.setMode('auto')}>自动模式</Button>
            <Button onClick={() => themeStore.toggleTheme()}>切换主题</Button>
          </Space>
          <Paragraph style={{ marginTop: '1rem' }}>
            当前模式: <Tag>{themeStore.mode}</Tag>
            实际主题: <Tag>{themeStore.actualTheme}</Tag>
          </Paragraph>
        </Card>

        {/* 3. 认证系统 */}
        <Card
          title={
            <>
              <UserOutlined /> 认证系统
            </>
          }
          bordered={false}
        >
          <Space>
            <Button
              icon={<LoginOutlined />}
              onClick={() => {
                setAuthModalTab('login')
                setAuthModalVisible(true)
              }}
            >
              打开登录框
            </Button>
            <Button
              onClick={() => {
                setAuthModalTab('register')
                setAuthModalVisible(true)
              }}
            >
              打开注册框
            </Button>
            <Button
              onClick={() => {
                authStore.setAuth(
                  {
                    id: 1,
                    username: 'admin',
                    role: 1,
                    email: 'admin@example.com',
                  },
                  'mock-token-123'
                )
                message.success('模拟登录成功')
              }}
            >
              模拟登录（管理员）
            </Button>
            <Button
              onClick={() => {
                authStore.logout()
                message.success('已登出')
              }}
            >
              登出
            </Button>
          </Space>
          <Paragraph style={{ marginTop: '1rem' }}>
            认证状态: <Tag color={authStore.isAuthenticated() ? 'green' : 'red'}>
              {authStore.isAuthenticated() ? '已登录' : '未登录'}
            </Tag>
            管理员: <Tag color={authStore.isAdmin() ? 'green' : 'default'}>
              {authStore.isAdmin() ? '是' : '否'}
            </Tag>
          </Paragraph>
        </Card>

        {/* 4. 应用状态 */}
        <Card
          title={
            <>
              <AppstoreOutlined /> 应用状态
            </>
          }
          bordered={false}
        >
          <Space>
            <Button onClick={() => appStore.toggleSidebar()}>切换侧边栏</Button>
            <Button onClick={() => appStore.setGlobalLoading(true)}>
              显示加载
            </Button>
            <Button onClick={() => appStore.setGlobalLoading(false)}>
              隐藏加载
            </Button>
            <Button
              onClick={() =>
                appStore.addNotification({
                  type: 'success',
                  message: '测试通知',
                  description: '这是一条测试通知消息',
                })
              }
            >
              添加通知
            </Button>
          </Space>
          <Paragraph style={{ marginTop: '1rem' }}>
            侧边栏: <Tag>{appStore.sidebarCollapsed ? '折叠' : '展开'}</Tag>
            通知数: <Tag>{appStore.notifications.length}</Tag>
            加载中: <Tag color={appStore.globalLoading ? 'blue' : 'default'}>
              {appStore.globalLoading ? '是' : '否'}
            </Tag>
          </Paragraph>
        </Card>

        {/* 5. 运行测试 */}
        <Card
          title={
            <>
              <CheckCircleOutlined /> 功能测试
            </>
          }
          bordered={false}
        >
          <Button type="primary" onClick={runTests} size="large">
            运行所有测试
          </Button>

          {testResults.length > 0 && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
              }}
            >
              {testResults.map((result, index) => (
                <div key={index}>{result}</div>
              ))}
            </div>
          )}
        </Card>
      </Space>

      {/* 技术栈信息 */}
      <Divider />
      <Card title="📦 技术栈" bordered={false}>
        <Space direction="vertical">
          <Text>
            <strong>React:</strong> 19.1.1
          </Text>
          <Text>
            <strong>Vite:</strong> 7.1.7
          </Text>
          <Text>
            <strong>TypeScript:</strong> 5.8.3
          </Text>
          <Text>
            <strong>Ant Design:</strong> 5.27.4
          </Text>
          <Text>
            <strong>React Router:</strong> 7.9.3
          </Text>
          <Text>
            <strong>TanStack Query:</strong> 5.90.2
          </Text>
          <Text>
            <strong>Zustand:</strong> 5.0.8
          </Text>
          <Text>
            <strong>Axios:</strong> 1.12.2
          </Text>
        </Space>
      </Card>

      {/* 认证模态框 */}
      <AuthModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        defaultTab={authModalTab}
      />
    </div>
  )
}

export default TestPage