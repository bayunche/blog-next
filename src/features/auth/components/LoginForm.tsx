/**
 * 登录表单组件
 */

import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useLogin } from '../hooks'
import type { LoginRequest } from '../types'

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
          用户登录
        </h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
          请输入您的登录凭据
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
          label="用户名"
          name="account"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 2, message: '用户名至少2个字符' },
            { max: 20, message: '用户名最多20个字符' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名"
            size="large"
            autoComplete="username"
          />
        </Form.Item>

        {/* 密码 */}
        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6个字符' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
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
            {loginMutation.isPending ? '登录中...' : '登录'}
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
        <span>还没有账号？</span>
        <Button
          type="link"
          size="small"
          onClick={onSwitchToRegister}
          style={{ padding: '0 0.5rem' }}
        >
          立即注册
        </Button>
      </div>
    </div>
  )
}

/**
 * 导出默认组件
 */
export default LoginForm