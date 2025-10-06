/**
 * Fragment API helpers
 */

import request from '@shared/utils/request'
import type { Fragment, FragmentListResponse, FragmentPayload } from '../types'

type FragmentRecord = Record<string, unknown>

type FragmentListServerResponse = {
  list?: FragmentRecord[]
  total?: number
}

const transformFragment = (item: FragmentRecord): Fragment => ({
  id: Number(item.id ?? 0),
  author: typeof item.author === 'string' ? item.author : null,
  content: typeof item.content === 'string' ? (item.content as string) : '',
  createdAt: typeof item.createdAt === 'string' ? (item.createdAt as string) : '',
  updatedAt: typeof item.updatedAt === 'string' ? (item.updatedAt as string) : undefined,
})

export const getFragmentListAPI = async (): Promise<FragmentListResponse> => {
  const response = await request.get<FragmentListServerResponse>('/fragment/list')
  const list = Array.isArray(response?.list) ? response.list.map(transformFragment) : []

  return {
    list,
    total: Number(response?.total ?? list.length),
  }
}

export const getFragmentDetailAPI = async (id: number): Promise<Fragment> => {
  const response = await request.get<FragmentRecord>(`/fragment/${id}`)
  return transformFragment(response ?? {})
}

export const createFragmentAPI = async (payload: FragmentPayload): Promise<void> => {
  await request.post('/fragment/create', payload)
}

export const updateFragmentAPI = async (id: number, payload: FragmentPayload): Promise<void> => {
  await request.put(`/fragment/${id}`, payload)
}

export const deleteFragmentAPI = async (id: number): Promise<void> => {
  await request.delete(`/fragment/${id}`)
}
