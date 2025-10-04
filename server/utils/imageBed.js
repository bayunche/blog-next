/**
 * 图床上传工具
 * 支持 Chevereto 图床
 */

const axios = require('axios')
const FormData = require('form-data')
const config = require('../config')

/**
 * 上传图片到 Chevereto 图床
 * @param {Buffer|String} imageData - 图片数据（Buffer 或 base64 字符串）
 * @param {String} filename - 文件名
 * @param {Object} options - 可选参数
 * @returns {Promise<Object>} 返回图片URL等信息
 */
async function uploadToChevereto(imageData, filename, options = {}) {
  const { url, apiKey, uploadEndpoint } = config.IMAGE_BED.chevereto

  if (!url || url === 'https://your-image-bed.com') {
    throw new Error('请配置 Chevereto 图床地址（CHEVERETO_URL 环境变量）')
  }

  const form = new FormData()

  // 如果是 Buffer，直接添加
  if (Buffer.isBuffer(imageData)) {
    form.append('source', imageData, { filename })
  }
  // 如果是 base64 字符串
  else if (typeof imageData === 'string') {
    // 移除 base64 前缀（如果有）
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
    form.append('source', base64Data)
  }
  // 如果是文件路径（URL）
  else if (typeof imageData === 'string' && imageData.startsWith('http')) {
    form.append('source', imageData)
  }

  // 添加可选参数
  if (options.title) form.append('title', options.title)
  if (options.description) form.append('description', options.description)
  if (options.albumId) form.append('album_id', options.albumId)
  if (options.categoryId) form.append('category_id', options.categoryId)

  try {
    const response = await axios.post(`${url}${uploadEndpoint}`, form, {
      headers: {
        ...form.getHeaders(),
        'X-API-Key': apiKey
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    })

    if (response.data && response.data.status_code === 200) {
      return {
        success: true,
        url: response.data.image.url,
        displayUrl: response.data.image.display_url,
        thumb: response.data.image.thumb.url,
        medium: response.data.image.medium.url,
        deleteUrl: response.data.image.delete_url,
        data: response.data.image
      }
    } else {
      throw new Error(response.data.error.message || '上传失败')
    }
  } catch (error) {
    console.error('图床上传失败:', error.message)
    if (error.response) {
      console.error('响应数据:', error.response.data)
      throw new Error(error.response.data.error?.message || '上传失败')
    }
    throw error
  }
}

/**
 * 通用图片上传接口
 * @param {Buffer|String} imageData - 图片数据
 * @param {String} filename - 文件名
 * @param {Object} options - 可选参数
 * @returns {Promise<Object>}
 */
async function uploadImage(imageData, filename, options = {}) {
  const bedType = config.IMAGE_BED.type

  switch (bedType) {
    case 'chevereto':
      return uploadToChevereto(imageData, filename, options)
    default:
      throw new Error(`不支持的图床类型: ${bedType}`)
  }
}

module.exports = {
  uploadImage,
  uploadToChevereto
}
