/**
 * 文章管理 Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'
import {
  getArticleManageListAPI,
  getArticleManageDetailAPI,
  createArticleAPI,
  updateArticleAPI,
  deleteArticleAPI,
  batchDeleteArticlesAPI,
  publishArticleAPI,
  batchPublishArticlesAPI,
  unpublishArticleAPI,
  uploadImageAPI,
  batchExportArticlesAPI,
  exportAllArticlesAPI,
  batchUpdateArticleStatusAPI,
  type ArticleManageParams,
  type ArticleFormData,
  type BatchUpdateStatusParams,
} from '../api/article'

/**
 * 获取文章管理列表 Hook
 */
export function useArticleManageList(params?: ArticleManageParams) {
  return useQuery({
    queryKey: ['admin-articles', params],
    queryFn: () => getArticleManageListAPI(params),
    staleTime: 1000 * 60 * 2, // 2分钟
  })
}

/**
 * 获取文章详情 Hook（编辑用）
 */
export function useArticleManageDetail(id: number) {
  return useQuery({
    queryKey: ['admin-article', id],
    queryFn: () => getArticleManageDetailAPI(id),
    enabled: !!id && id > 0,
  })
}

/**
 * 创建文章 Hook
 */
export function useCreateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ArticleFormData) => createArticleAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      message.success('文章创建成功')
    },
    onError: (error: Error) => {
      message.error(error.message || '创建失败')
    },
  })
}

/**
 * 更新文章 Hook
 */
export function useUpdateArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ArticleFormData }) =>
      updateArticleAPI(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      queryClient.invalidateQueries({ queryKey: ['admin-article', variables.id] })
      message.success('文章更新成功')
    },
    onError: (error: Error) => {
      message.error(error.message || '更新失败')
    },
  })
}

/**
 * 删除文章 Hook
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteArticleAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      message.success('删除成功')
    },
    onError: (error: Error) => {
      message.error(error.message || '删除失败')
    },
  })
}

/**
 * 批量删除文章 Hook
 */
export function useBatchDeleteArticles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: number[]) => batchDeleteArticlesAPI(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      message.success('批量删除成功')
    },
    onError: (error: Error) => {
      message.error(error.message || '批量删除失败')
    },
  })
}

/**
 * 发布文章 Hook
 */
export function usePublishArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => publishArticleAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      message.success('发布成功')
    },
    onError: (error: Error) => {
      message.error(error.message || '发布失败')
    },
  })
}

/**
 * 批量发布文章 Hook
 */
export function useBatchPublishArticles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: number[]) => batchPublishArticlesAPI(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      message.success('批量发布成功')
    },
    onError: (error: Error) => {
      message.error(error.message || '批量发布失败')
    },
  })
}

/**
 * 取消发布文章 Hook
 */
export function useUnpublishArticle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => unpublishArticleAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      message.success('已转为草稿')
    },
    onError: (error: Error) => {
      message.error(error.message || '操作失败')
    },
  })
}

/**
 * 批量导出文章 Hook
 */
export function useBatchExportArticles() {
  return useMutation({
    mutationFn: (ids: number[]) => batchExportArticlesAPI(ids),
    onSuccess: () => {
      message.success('文章导出已开始，请稍候下载')
    },
    onError: (error: Error) => {
      message.error(error.message || '导出失败')
    },
  })
}

/**
 * 导出所有文章 Hook
 */
export function useExportAllArticles() {
  return useMutation({
    mutationFn: () => exportAllArticlesAPI(),
    onSuccess: () => {
      message.success('全部文章导出已开始，请稍候下载')
    },
    onError: (error: Error) => {
      message.error(error.message || '导出失败')
    },
  })
}

/**
 * 批量更新文章状态 Hook
 */
export function useBatchUpdateArticleStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: BatchUpdateStatusParams) => batchUpdateArticleStatusAPI(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      message.success('批量更新成功')
    },
    onError: (error: Error) => {
      message.error(error.message || '批量更新失败')
    },
  })
}

/**
 * 上传图片 Hook
 */
export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadImageAPI(file),
    onError: (error: Error) => {
      message.error(error.message || '上传失败')
    },
  })
}
