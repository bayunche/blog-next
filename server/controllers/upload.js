/**
 * Image upload controllers.
 * Handles external provider uploads and protected local fallback uploads.
 */

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const { uploadImage, normalizeUploadResult } = require('../utils/imageBed')
const { uploadPath } = require('../utils/file')

const LOCAL_IMAGE_DIRECTORY = path.join(uploadPath, 'article-media')
const MIME_EXTENSION_MAP = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
  'image/bmp': '.bmp',
  'image/x-icon': '.ico',
}

const ensureDirectory = targetPath => {
  fs.mkdirSync(targetPath, { recursive: true })
}

const toFileList = files => {
  if (!files) return []
  return Array.isArray(files) ? files : [files]
}

const getPrimaryFile = requestFiles => {
  if (!requestFiles) return null
  if (requestFiles.file) {
    return Array.isArray(requestFiles.file) ? requestFiles.file[0] : requestFiles.file
  }
  if (requestFiles.files) {
    return Array.isArray(requestFiles.files) ? requestFiles.files[0] : requestFiles.files
  }
  return null
}

const getUploadFilename = file => file?.originalFilename || file?.newFilename || `image-${Date.now()}.png`

const isImageFile = file => {
  if (!file) return false
  if (file.mimetype) {
    return file.mimetype.startsWith('image/')
  }
  const extension = path.extname(getUploadFilename(file)).toLowerCase()
  return Boolean(extension) && Object.values(MIME_EXTENSION_MAP).includes(extension)
}

const buildResponseData = result => ({
  url: result.url,
  displayUrl: result.displayUrl,
  thumb: result.thumb,
  medium: result.medium,
  deleteUrl: result.deleteUrl || '',
  markdown: result.markdown || '',
  provider: result.provider || 'unknown',
  source: result.provider || 'unknown',
})

const sanitizeAltText = value =>
  String(value || 'image')
    .replace(/\.[^.]+$/, '')
    .replace(/[\[\]\(\)]/g, '')
    .trim() || 'image'

const saveLocalImage = file => {
  if (!file) {
    throw new Error('请提供图片文件')
  }

  if (!isImageFile(file)) {
    throw new Error('仅支持上传图片文件作为本地回退')
  }

  ensureDirectory(LOCAL_IMAGE_DIRECTORY)

  const originalName = getUploadFilename(file)
  const sourceExtension = path.extname(originalName).toLowerCase()
  const extension = sourceExtension || MIME_EXTENSION_MAP[file.mimetype] || '.png'
  const storedFileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`
  const publicUrl = `/public/uploads/article-media/${encodeURIComponent(storedFileName)}`
  const targetPath = path.join(LOCAL_IMAGE_DIRECTORY, storedFileName)

  fs.copyFileSync(file.filepath, targetPath)

  return normalizeUploadResult({
    provider: 'local',
    url: publicUrl,
    displayUrl: publicUrl,
    thumbnailUrl: publicUrl,
    mediumUrl: publicUrl,
    filename: sanitizeAltText(originalName),
    originalData: {
      originalName,
      storedFileName,
    },
  })
}

exports.uploadImage = async ctx => {
  try {
    const file = getPrimaryFile(ctx.request.files)
    const { base64, url, title, description } = ctx.request.body || {}

    if (!file && !base64 && !url) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '请提供图片文件、base64 数据或图片 URL',
      }
      return
    }

    let imageData
    let filename

    if (file) {
      imageData = fs.readFileSync(file.filepath)
      filename = getUploadFilename(file)
    } else if (base64) {
      imageData = base64
      filename = `image-${Date.now()}.png`
    } else {
      imageData = url
      filename = path.basename(new URL(url).pathname) || `image-${Date.now()}.png`
    }

    const result = await uploadImage(imageData, filename, {
      title,
      description,
    })

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '上传成功',
      data: buildResponseData(result),
    }
  } catch (error) {
    console.error('上传图片到外部图床失败:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: error.message || '上传失败',
    }
  }
}

exports.uploadLocalImage = async ctx => {
  try {
    const file = getPrimaryFile(ctx.request.files)

    if (!file) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '请提供图片文件以进行本地回退上传',
      }
      return
    }

    const result = saveLocalImage(file)

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '已完成本地回退上传',
      data: buildResponseData(result),
    }
  } catch (error) {
    console.error('本地图片回退上传失败:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: error.message || '本地上传失败',
    }
  }
}

exports.uploadImages = async ctx => {
  try {
    const requestFiles = ctx.request.files || {}
    const sourceFiles = toFileList(requestFiles.files || requestFiles.file)

    if (sourceFiles.length === 0) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '请提供图片文件',
      }
      return
    }

    const results = await Promise.all(
      sourceFiles.map(async file => {
        const imageData = fs.readFileSync(file.filepath)
        const filename = getUploadFilename(file)
        return uploadImage(imageData, filename)
      })
    )

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '批量上传成功',
      data: results.map(buildResponseData),
    }
  } catch (error) {
    console.error('批量上传图片失败:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: error.message || '批量上传失败',
    }
  }
}
