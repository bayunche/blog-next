import request from './request'

export interface LoginParams {
    account: string
    password?: string
    code?: string
    redirectUri?: string
    state?: string
}

export interface LoginResponse {
    username: string
    role: number
    userId: number
    token: string
    email?: string
    github?: unknown
}

export interface GithubOAuthConfigResponse {
    enabled: boolean
    clientId: string
    redirectUri: string
}

export const authApi = {
    login: (data: LoginParams) => {
        return request.post<unknown, LoginResponse>('/login', data)
    },

    register: (data: Record<string, unknown>) => {
        return request.post<unknown, unknown>('/register', data)
    },

    githubLogin: (data: Pick<LoginParams, 'code' | 'redirectUri' | 'state'>) => {
        return request.post<unknown, LoginResponse>('/login', data)
    },

    getGithubOAuthConfig: () => {
        return request.get<unknown, GithubOAuthConfigResponse>('/github/oauth/config')
    },
}
