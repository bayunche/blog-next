/**
 * 认证模态框组件
 * 包含登录和注册功能
 */

import { useState } from 'react'
import { Modal, Tabs, Divider, Button, Space } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useGithubAuth } from '../hooks'
import type { AuthModalType } from '../types'
import { useTranslation } from 'react-i18next'

/**
 * 认证模态框属性
 */
interface AuthModalProps {
  /** 是否显示 */
  visible: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 初始标签页类型 */
  defaultTab?: AuthModalType
}

/**
 * 认证模态框组件
 */
export function AuthModal({
  visible,
  onClose,
  defaultTab = 'login',
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthModalType>(defaultTab)
  const { t } = useTranslation('auth')

  // GitHub OAuth Hook
  const { isGithubAuthAvailable, startGithubAuth, isProcessing } = useGithubAuth({
    onSuccess: () => {
      onClose()
    },
  })

  /**
   * 处理标签页切换
   */
  const handleTabChange = (key: string) => {
    setActiveTab(key as AuthModalType)
  }

  /**
   * 处理关闭
   */
  const handleClose = () => {
    setActiveTab('login')
    onClose()
  }

  /**
   * 处理登录成功
   */
  const handleLoginSuccess = () => {
    handleClose()
  }

  /**
   * 处理注册成功
   */
  const handleRegisterSuccess = () => {
    // 注册成功后切换到登录页面
    setActiveTab('login')
  }

  /**
   * 切换到登录页面
   */
  const switchToLogin = () => {
    setActiveTab('login')
  }

  /**
   * 切换到注册页面
   */
  const switchToRegister = () => {
    setActiveTab('register')
  }

  /**
   * 处理 GitHub 登录
   */
  const handleGithubLogin = () => {
    startGithubAuth()
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={480}
      centered
      destroyOnClose
      styles={{
        body: { padding: '2rem' },
      }}
    >
      {/* 标签页 */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        centered
        items={[
          {
            key: 'login',
            label: t('modal.loginTab'),
            children: (
              <LoginForm
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={switchToRegister}
              />
            ),
          },
          {
            key: 'register',
            label: t('modal.registerTab'),
            children: (
              <RegisterForm
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={switchToLogin}
              />
            ),
          },
        ]}
      />

      {/* GitHub 登录 */}
      {isGithubAuthAvailable && (
        <>
          <Divider plain style={{ margin: '1.5rem 0' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {t('modal.or')}
            </span>
          </Divider>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button
              size="large"
              block
              icon={<GithubOutlined />}
              onClick={handleGithubLogin}
              loading={isProcessing}
              style={{
                background: '#24292e',
                color: '#fff',
                borderColor: '#24292e',
              }}
            >
              {t('modal.githubLogin')}
            </Button>
          </Space>
        </>
      )}
    </Modal>
  )
}

/**
 * 导出默认组件
 */
export default AuthModal
