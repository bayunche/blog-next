import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { getDashboardOverviewAPI } from '../api/dashboard'
import type { DashboardResponse } from '../types'

const DASHBOARD_OVERVIEW_KEY = ['admin', 'dashboard', 'overview'] as const

export function useDashboardOverview(
  options?: UseQueryOptions<DashboardResponse, Error, DashboardResponse>,
) {
  return useQuery<DashboardResponse, Error>({
    queryKey: DASHBOARD_OVERVIEW_KEY,
    queryFn: getDashboardOverviewAPI,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export default useDashboardOverview
