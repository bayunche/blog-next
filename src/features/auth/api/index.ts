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
 * @param data 登录请求参数
 * @returns 登录响应数据
 */
export const loginAPI = (data: LoginRequest): Promise<LoginResponse> => {
  return request.post('/login', data)
}

/**
 * 用户注册
 * @param data 注册请求参数
 * @returns 注册响应数据
 */
export const registerAPI = (data: RegisterRequest): Promise<RegisterResponse> => {
  return request.post('/register', data)
}

/**
 * 用户登出
 * @returns Promise
 */
export const logoutAPI = (): Promise<void> => {
  return request.post('/logout')
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export const getUserInfoAPI = (): Promise<LoginResponse> => {
  return request.get('/user/info')
}

/**
 * GitHub OAuth 登录回调
 * @param params 回调参数
 * @returns GitHub 认证响应
 */
export const githubAuthCallbackAPI = (
  params: GithubCallbackParams
): Promise<GithubAuthResponse> => {
  return request.post('/oauth/github/callback', params)
}

/**
 * 刷新 Token
 * @param token 当前 Token
 * @returns 新的 Token
 */
export const refreshTokenAPI = (token: string): Promise<{ token: string }> => {
  return request.post('/auth/refresh', { token })
}