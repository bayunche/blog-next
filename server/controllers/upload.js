/**
 * 文件上传控制器
 * 处理图片上传到图床
 */

const { uploadImage } = require('../utils/imageBed')

/**
 * 上传图片到图床
 * POST /api/upload/image
 */
exports.uploadImage = async (ctx) => {
  try {
    const { file } = ctx.request.files || {}
    const { base64, url, title, description } = ctx.request.body || {}

    if (!file && !base64 && !url) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '请提供图片文件、base64 数据或图片 URL'
      }
      return
    }

    let imageData
    let filename

    // 处理文件上传
    if (file) {
      const fs = require('fs')
      imageData = fs.readFileSync(file.filepath)
      filename = file.originalFilename || file.newFilename
    }
    // 处理 base64
    else if (base64) {
      imageData = base64
      filename = `image-${Date.now()}.png`
    }
    // 处理 URL
    else if (url) {
      imageData = url
      filename = url.split('/').pop()
    }

    // 上传到图床
    const result = await uploadImage(imageData, filename, {
      title,
      description
    })

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '上传成功',
      data: {
        url: result.url,
        displayUrl: result.displayUrl,
        thumb: result.thumb,
        medium: result.medium
      }
    }
  } catch (error) {
    console.error('上传图片失败:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: error.message || '上传失败'
    }
  }
}

/**
 * 批量上传图片
 * POST /api/upload/images
 */
exports.uploadImages = async (ctx) => {
  try {
    const { files } = ctx.request.files || {}

    if (!files || files.length === 0) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '请提供图片文件'
      }
      return
    }

    const fs = require('fs')
    const uploadPromises = files.map(async (file) => {
      const imageData = fs.readFileSync(file.filepath)
      const filename = file.originalFilename || file.newFilename
      return uploadImage(imageData, filename)
    })

    const results = await Promise.all(uploadPromises)

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '批量上传成功',
      data: results.map(result => ({
        url: result.url,
        displayUrl: result.displayUrl,
        thumb: result.thumb,
        medium: result.medium
      }))
    }
  } catch (error) {
    console.error('批量上传图片失败:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: error.message || '批量上传失败'
    }
  }
}
