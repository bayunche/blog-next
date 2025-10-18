/**
 * GitHub 贡献数据 Hook
 */
import { useQuery } from '@tanstack/react-query'
import { getGithubContributionsAPI, queryKeys } from '@shared/api'
import type { GithubContributionRecord } from '@shared/api/user'

/**
 * 获取 GitHub 贡献数据
 */
export function useGithubContributions() {
  return useQuery<GithubContributionRecord[]>({
    queryKey: queryKeys.users.contributions(),
    queryFn: getGithubContributionsAPI,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  })
}

export default useGithubContributions
