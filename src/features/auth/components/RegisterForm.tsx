/**
 * 注册表单组件
 */

import { Form, Input, Button } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import { useRegister } from '../hooks'
import type { RegisterRequest } from '../types'
import { useTranslation } from 'react-i18next'

/**
 * 注册表单属性
 */
interface RegisterFormProps {
  /** 注册成功回调 */
  onSuccess?: () => void
  /** 切换到登录页面 */
  onSwitchToLogin?: () => void
}

/**
 * 注册表单组件
 */
export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [form] = Form.useForm<RegisterRequest>()
  const { t } = useTranslation('auth')

  // 使用注册 Hook
  const registerMutation = useRegister({
    onSuccess: () => {
      form.resetFields()
      onSuccess?.()
    },
  })

  /**
   * 处理表单提交
   */
  const handleSubmit = (values: RegisterRequest) => {
    registerMutation.mutate(values)
  }

  return (
    <div className="register-form">
      {/* 表单标题 */}
      <div className="form-header" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
          {t('form.registerTitle')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
          {t('form.registerSubtitle')}
        </p>
      </div>

      {/* 注册表单 */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        {/* 用户名 */}
        <Form.Item
          label={t('form.account')}
          name="username"
          rules={[
            { required: true, message: t('form.accountRequired') },
            { min: 2, message: t('form.accountMin') },
            { max: 20, message: t('form.accountMax') },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message: t('form.accountPattern'),
            },
          ]}
          hasFeedback
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('form.accountPlaceholderDetailed')}
            size="large"
            autoComplete="username"
          />
        </Form.Item>

        {/* 邮箱 */}
        <Form.Item
          label={t('form.email')}
          name="email"
          rules={[
            { required: true, message: t('form.emailRequired') },
            { type: 'email', message: t('form.emailInvalid') },
          ]}
          hasFeedback
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('form.emailPlaceholder')}
            size="large"
            autoComplete="email"
          />
        </Form.Item>

        {/* 密码 */}
        <Form.Item
          label={t('form.password')}
          name="password"
          rules={[
            { required: true, message: t('form.passwordRequired') },
            { min: 8, message: t('form.passwordMin') },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: t('form.passwordStrongRule'),
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder={t('form.passwordStrongPlaceholder')}
            size="large"
            autoComplete="new-password"
          />
        </Form.Item>

        {/* 确认密码 */}
        <Form.Item
          label={t('form.confirmPassword')}
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: t('form.confirmPasswordRequired') },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(t('form.confirmPasswordMismatch')))
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<SafetyOutlined />}
            placeholder={t('form.confirmPasswordPlaceholder')}
            size="large"
            autoComplete="new-password"
          />
        </Form.Item>

        {/* 提交按钮 */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={registerMutation.isPending}
            block
            style={{ marginTop: '0.5rem' }}
          >
            {registerMutation.isPending ? t('form.registerSubmitting') : t('form.register')}
          </Button>
        </Form.Item>
      </Form>

      {/* 密码提示 */}
      <div
        className="password-tips"
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
        }}
      >
        <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
          {t('form.passwordTipsTitle')}
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
          <li>{t('form.passwordTips.length')}</li>
          <li>{t('form.passwordTips.case')}</li>
          <li>{t('form.passwordTips.number')}</li>
          <li>{t('form.passwordTips.special')}</li>
        </ul>
      </div>

      {/* 底部链接 */}
      <div
        className="form-footer"
        style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: 'var(--text-secondary)',
        }}
      >
        <span>{t('form.alreadyAccount')}</span>
        <Button
          type="link"
          size="small"
          onClick={onSwitchToLogin}
          style={{ padding: '0 0.5rem' }}
        >
          {t('form.switchToLoginLink')}
        </Button>
      </div>
    </div>
  )
}

/**
 * 导出默认组件
 */
export default RegisterForm
