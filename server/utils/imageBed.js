/**
 * Image bed upload helpers.
 * Supports PicUI and the existing Chevereto-compatible providers.
 */

const path = require('path')
const axios = require('axios')
const FormData = require('form-data')

const config = require('../config')

const joinUrl = (baseUrl, pathname) => `${String(baseUrl || '').replace(/\/+$/, '')}/${String(pathname || '').replace(/^\/+/, '')}`

const isRemoteUrl = value => /^https?:\/\//i.test(String(value || ''))

const sanitizeAltText = value =>
  String(value || 'image')
    .replace(/\.[^.]+$/, '')
    .replace(/[\[\]\(\)]/g, '')
    .trim() || 'image'

const extractUploadErrorMessage = (error, fallback) => {
  if (error?.response?.data?.message) {
    return String(error.response.data.message)
  }

  if (error?.response?.data?.error?.message) {
    return String(error.response.data.error.message)
  }

  if (error?.message) {
    return String(error.message)
  }

  return fallback
}

const normalizeUploadResult = ({
  provider,
  url,
  displayUrl,
  thumbnailUrl,
  mediumUrl,
  deleteUrl,
  markdown,
  filename,
  originalData,
}) => {
  const canonicalUrl = displayUrl || url || mediumUrl || thumbnailUrl

  if (!canonicalUrl) {
    throw new Error('图床未返回可用的图片地址')
  }

  return {
    success: true,
    provider,
    url: url || canonicalUrl,
    displayUrl: canonicalUrl,
    thumb: thumbnailUrl || mediumUrl || canonicalUrl,
    medium: mediumUrl || canonicalUrl,
    deleteUrl: deleteUrl || '',
    markdown: markdown || `![${sanitizeAltText(filename)}](${canonicalUrl})`,
    data: originalData,
  }
}

const resolvePicuiFilePart = async (imageData, filename) => {
  if (Buffer.isBuffer(imageData)) {
    return { value: imageData, options: { filename } }
  }

  if (typeof imageData !== 'string') {
    throw new Error('不支持的 PicUI 图片数据格式')
  }

  if (isRemoteUrl(imageData)) {
    const response = await axios.get(imageData, { responseType: 'arraybuffer', timeout: 30000 })
    const remoteFilename = filename || path.basename(new URL(imageData).pathname) || `remote-${Date.now()}.bin`
    return {
      value: Buffer.from(response.data),
      options: { filename: remoteFilename },
    }
  }

  const base64Data = imageData.replace(/^data:image\/[\w.+-]+;base64,/, '')

  return {
    value: Buffer.from(base64Data, 'base64'),
    options: { filename },
  }
}

async function uploadToChevereto(imageData, filename, options = {}) {
  const { url, apiKey, uploadEndpoint } = config.IMAGE_BED.chevereto

  if (!url || url === 'https://your-image-bed.com') {
    throw new Error('请配置 Chevereto 图床地址（CHEVERETO_URL 环境变量）')
  }

  const form = new FormData()

  if (Buffer.isBuffer(imageData)) {
    form.append('source', imageData, { filename })
  } else if (typeof imageData === 'string' && isRemoteUrl(imageData)) {
    form.append('source', imageData)
  } else if (typeof imageData === 'string') {
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
    form.append('source', base64Data)
  } else {
    throw new Error('不支持的 Chevereto 图片数据格式')
  }

  if (options.title) form.append('title', options.title)
  if (options.description) form.append('description', options.description)
  if (options.albumId) form.append('album_id', options.albumId)
  if (options.categoryId) form.append('category_id', options.categoryId)

  try {
    const response = await axios.post(joinUrl(url, uploadEndpoint), form, {
      headers: {
        ...form.getHeaders(),
        'X-API-Key': apiKey,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 30000,
    })

    if (response.data?.status_code !== 200 || !response.data?.image) {
      throw new Error(response.data?.error?.message || 'Chevereto 上传失败')
    }

    const image = response.data.image

    return normalizeUploadResult({
      provider: 'chevereto',
      url: image.url,
      displayUrl: image.display_url,
      thumbnailUrl: image.thumb?.url,
      mediumUrl: image.medium?.url,
      deleteUrl: image.delete_url,
      filename: image.filename || filename,
      originalData: image,
    })
  } catch (error) {
    throw new Error(extractUploadErrorMessage(error, 'Chevereto 上传失败'))
  }
}

async function uploadToPicui(imageData, filename, options = {}) {
  const { apiUrl, token, strategyId, permission, albumId, expiredAt } = config.IMAGE_BED.picui

  if (!token) {
    throw new Error('请配置 PicUI 上传令牌（PICUI_TOKEN 环境变量）')
  }

  const filePart = await resolvePicuiFilePart(imageData, filename)
  const form = new FormData()

  form.append('file', filePart.value, filePart.options)

  const resolvedStrategyId = options.strategyId || strategyId
  const resolvedPermission = options.permission || permission
  const resolvedAlbumId = options.albumId || albumId
  const resolvedExpiredAt = options.expiredAt || expiredAt

  if (resolvedStrategyId) form.append('strategy_id', String(resolvedStrategyId))
  if (resolvedPermission !== undefined && resolvedPermission !== null && resolvedPermission !== '') {
    form.append('permission', String(resolvedPermission))
  }
  if (resolvedAlbumId) form.append('album_id', String(resolvedAlbumId))
  if (resolvedExpiredAt) form.append('expired_at', String(resolvedExpiredAt))

  try {
    const response = await axios.post(joinUrl(apiUrl, 'upload'), form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 30000,
    })

    if (!response.data?.status || !response.data?.data) {
      throw new Error(response.data?.message || 'PicUI 上传失败')
    }

    const image = response.data.data
    const links = image.links || {}

    return normalizeUploadResult({
      provider: 'picui',
      url: links.url || image.url,
      displayUrl: links.url || image.url,
      thumbnailUrl: links.thumbnail_url || links.url,
      mediumUrl: links.thumbnail_url || links.url,
      deleteUrl: links.delete_url,
      markdown: links.markdown,
      filename: image.origin_name || image.name || filename,
      originalData: image,
    })
  } catch (error) {
    throw new Error(extractUploadErrorMessage(error, 'PicUI 上传失败'))
  }
}

async function uploadImage(imageData, filename, options = {}) {
  const bedType = config.IMAGE_BED.type

  switch (bedType) {
    case 'chevereto':
      return uploadToChevereto(imageData, filename, options)
    case 'picui':
      return uploadToPicui(imageData, filename, options)
    default:
      throw new Error(`不支持的图床类型: ${bedType}`)
  }
}

module.exports = {
  uploadImage,
  uploadToChevereto,
  uploadToPicui,
  normalizeUploadResult,
}
