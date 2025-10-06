/**
 * 认证 API 接口
 */

import { request } from '@shared/api'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  GithubCallbackParams,
  GithubAuthResponse,
} from '../types'

/**
 * 用户登录
 * 后端返回格式：{ username, role, userId, token, email }
 */
export const loginAPI = async (data: LoginRequest): Promise<LoginResponse> => {
  const response: any = await request.post('/login', data)
  
  console.log('📡 登录响应:', response)

  // 后端直接返回 { username, role, userId, token, email }
  // 转换为前端期望的格式
  return {
    user: {
      id: response.userId,
      username: response.username,
      email: response.email,
      role: response.role,
    },
    token: response.token,
  }
}

/**
 * 用户注册
 * 后端返回 204 状态码，无响应体
 */
export const registerAPI = async (data: RegisterRequest): Promise<RegisterResponse> => {
  await request.post('/register', data)

  // 后端返回 204，无响应体
  return {
    user: {
      id: 0,
      username: data.username,
      email: data.email,
      role: 2,
    },
    message: '注册成功！请登录',
  }
}

/**
 * 用户登出
 */
export const logoutAPI = (): Promise<void> => {
  return request.post('/logout')
}

/**
 * 获取当前用户信息
 */
export const getUserInfoAPI = (): Promise<LoginResponse> => {
  return request.get('/user/info')
}

/**
 * GitHub OAuth 登录回调
 */
export const githubAuthCallbackAPI = (
  params: GithubCallbackParams
): Promise<GithubAuthResponse> => {
  return request.post('/oauth/github/callback', params)
}

/**
 * 刷新 Token
 */
export const refreshTokenAPI = (token: string): Promise<{ token: string }> => {
  return request.post('/auth/refresh', { token })
}
