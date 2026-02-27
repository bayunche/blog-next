import request from './request'
import type { User } from '../types/user'

export interface LoginParams {
    account: string
    password?: string
    code?: string
}

export interface LoginResponse {
    username: string
    role: number
    userId: number
    token: string
    email?: string
    github?: any
}

export const authApi = {
    login: (data: LoginParams) => {
        return request.post<any, LoginResponse>('/login', data)
    },

    register: (data: any) => {
        return request.post('/register', data)
    },

    githubLogin: (code: string) => {
        return request.post<any, LoginResponse>('/login', { code })
    },
}
