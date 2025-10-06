/**
 * 用户相关 API
 */

import request from '@shared/api/axios'

export interface GithubContributionRecord {
  date: string
  count: number
}

/**
 * 获取 GitHub 贡献数据
 */
export const getGithubContributionsAPI = (): Promise<GithubContributionRecord[]> => {
  return request.get('/user/github/contributions')
}
