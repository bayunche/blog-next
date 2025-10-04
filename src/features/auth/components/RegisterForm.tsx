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
          用户注册
        </h3>
        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
          创建您的新账号
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
          label="用户名"
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 2, message: '用户名至少2个字符' },
            { max: 20, message: '用户名最多20个字符' },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message: '用户名只能包含字母、数字和下划线',
            },
          ]}
          hasFeedback
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入用户名（2-20个字符）"
            size="large"
            autoComplete="username"
          />
        </Form.Item>

        {/* 邮箱 */}
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
          hasFeedback
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="请输入邮箱地址"
            size="large"
            autoComplete="email"
          />
        </Form.Item>

        {/* 密码 */}
        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 8, message: '密码至少8个字符' },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
              message: '密码必须包含大小写字母和数字',
            },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码（至少8位，包含大小写字母和数字）"
            size="large"
            autoComplete="new-password"
          />
        </Form.Item>

        {/* 确认密码 */}
        <Form.Item
          label="确认密码"
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('两次输入的密码不一致'))
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<SafetyOutlined />}
            placeholder="请再次输入密码"
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
            {registerMutation.isPending ? '注册中...' : '注册'}
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
          密码要求：
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
          <li>至少8个字符</li>
          <li>包含大小写字母</li>
          <li>包含数字</li>
          <li>可包含特殊字符</li>
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
        <span>已有账号？</span>
        <Button
          type="link"
          size="small"
          onClick={onSwitchToLogin}
          style={{ padding: '0 0.5rem' }}
        >
          立即登录
        </Button>
      </div>
    </div>
  )
}

/**
 * 导出默认组件
 */
export default RegisterForm