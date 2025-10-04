/**
 * 认证相关类型定义
 */

import type { User } from '@shared/stores/types'

/**
 * 登录请求参数
 */
export interface LoginRequest {
  /** 账号（用户名） */
  account: string
  /** 密码 */
  password: string
}

/**
 * 注册请求参数
 */
export interface RegisterRequest {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 确认密码 */
  confirm: string
  /** 邮箱 */
  email: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  /** 用户信息 */
  user: User
  /** 认证 Token */
  token: string
}

/**
 * 注册响应数据
 */
export interface RegisterResponse {
  /** 用户信息 */
  user: User
  /** 消息 */
  message: string
}

/**
 * GitHub OAuth 回调参数
 */
export interface GithubCallbackParams {
  /** 授权码 */
  code: string
  /** 状态码 */
  state?: string
}

/**
 * GitHub OAuth 响应
 */
export interface GithubAuthResponse {
  /** 用户信息 */
  user: User
  /** 认证 Token */
  token: string
}

/**
 * 表单验证规则类型
 */
export interface FormRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  min?: number
  max?: number
  validator?: (rule: any, value: any) => Promise<void>
}

/**
 * 认证模态框类型
 */
export type AuthModalType = 'login' | 'register'