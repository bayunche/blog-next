/**
 * Fragment hooks built on TanStack Query
 */

import { useMutation, useQuery, useQueryClient, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query'
import {
  createFragmentAPI,
  deleteFragmentAPI,
  getFragmentDetailAPI,
  getFragmentListAPI,
  updateFragmentAPI,
} from '../api'
import type { Fragment, FragmentListResponse, FragmentPayload } from '../types'

export const fragmentQueryKeys = {
  all: ['fragments'] as const,
  detail: (id: number) => ['fragment', id] as const,
}

export const useFragmentList = (
  options?: UseQueryOptions<FragmentListResponse, Error, FragmentListResponse>,
) => {
  return useQuery<FragmentListResponse, Error>({
    queryKey: fragmentQueryKeys.all,
    queryFn: getFragmentListAPI,
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

export const useFragmentDetail = (
  id: number,
  options?: Omit<UseQueryOptions<Fragment, Error, Fragment>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<Fragment, Error>({
    queryKey: fragmentQueryKeys.detail(id),
    queryFn: () => getFragmentDetailAPI(id),
    enabled: id > 0,
    ...options,
  })
}

export const useCreateFragment = (
  options?: UseMutationOptions<void, Error, FragmentPayload>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFragmentAPI,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: fragmentQueryKeys.all })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useUpdateFragment = (
  id: number,
  options?: UseMutationOptions<void, Error, FragmentPayload>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: FragmentPayload) => updateFragmentAPI(id, payload),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: fragmentQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: fragmentQueryKeys.detail(id) })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useDeleteFragment = (
  options?: UseMutationOptions<void, Error, number>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteFragmentAPI(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: fragmentQueryKeys.all })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}
