/**
 * 登录表单组件
 */

import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useLogin } from '../hooks'
import type { LoginRequest } from '../types'
import { useTranslation } from 'react-i18next'

/**
 * 登录表单属性
 */
interface LoginFormProps {
  /** 登录成功回调 */
  onSuccess?: () => void
  /** 切换到注册页面 */
  onSwitchToRegister?: () => void
}

/**
 * 登录表单组件
 */
export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [form] = Form.useForm<LoginRequest>()
  const { t } = useTranslation('auth')

  // 使用登录 Hook
  const loginMutation = useLogin({
    onSuccess: () => {
      form.resetFields()
      onSuccess?.()
    },
  })

  /**
   * 处理表单提交
   */
  const handleSubmit = (values: LoginRequest) => {
    loginMutation.mutate(values)
  }

  return (
    <div className="login-form">
      {/* 表单标题 */}
      <div className="form-header" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
          {t('form.loginTitle')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
          {t('form.loginSubtitle')}
        </p>
      </div>

      {/* 登录表单 */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {/* 用户名 */}
        <Form.Item
          label={t('form.account')}
          name="account"
          rules={[
            { required: true, message: t('form.accountRequired') },
            { min: 2, message: t('form.accountMin') },
            { max: 20, message: t('form.accountMax') },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('form.accountPlaceholder')}
            size="large"
            autoComplete="username"
          />
        </Form.Item>

        {/* 密码 */}
        <Form.Item
          label={t('form.password')}
          name="password"
          rules={[
            { required: true, message: t('form.passwordRequired') },
            { min: 6, message: t('form.passwordMin') },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('form.passwordPlaceholder')}
            size="large"
            autoComplete="current-password"
          />
        </Form.Item>

        {/* 提交按钮 */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loginMutation.isPending}
            block
            style={{ marginTop: '0.5rem' }}
          >
            {loginMutation.isPending ? t('form.loginSubmitting') : t('form.login')}
          </Button>
        </Form.Item>
      </Form>

      {/* 底部链接 */}
      <div
        className="form-footer"
        style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: 'var(--text-secondary)',
        }}
      >
        <span>{t('form.noAccountShort')}</span>
        <Button
          type="link"
          size="small"
          onClick={onSwitchToRegister}
          style={{ padding: '0 0.5rem' }}
        >
          {t('form.switchToRegister')}
        </Button>
      </div>
    </div>
  )
}

/**
 * 导出默认组件
 */
export default LoginForm
