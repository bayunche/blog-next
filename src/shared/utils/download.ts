/**
 * 文件下载工具函数
 * 用于触发浏览器文件下载
 */

import request from '@shared/api/axios'

/**
 * 下载文件
 * @param url - 下载 URL
 * @param filename - 文件名（可选）
 */
export const downloadFile = async (url: string, filename?: string): Promise<void> => {
  try {
    // 使用 request 实例获取文件数据（支持认证）
    const response = await request.get(url, {
      responseType: 'blob',
    })

    // 创建 Blob URL
    const blob = new Blob([response])
    const blobUrl = window.URL.createObjectURL(blob)

    // 创建临时下载链接
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename || `download_${Date.now()}`

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('下载失败:', error)
    throw error
  }
}

/**
 * 批量导出文章
 * @param ids - 文章 ID 列表
 */
export const downloadArticles = async (ids: number[]): Promise<void> => {
  const url = `/article/output/list/${ids.join(',')}`
  return downloadFile(url, `articles_${ids.length}_${Date.now()}.zip`)
}

/**
 * 导出所有文章
 */
export const downloadAllArticles = async (): Promise<void> => {
  const url = '/article/output/all'
  return downloadFile(url, `all_articles_${Date.now()}.zip`)
}

export default downloadFile
