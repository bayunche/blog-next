const Router = require('koa-router')
const router = new Router({ prefix: '/api/upload' })

const {
  uploadImage,
  uploadImages
} = require('../controllers/upload')

router
  .post('/image', uploadImage) // 上传单张图片
  .post('/images', uploadImages) // 批量上传图片

module.exports = router
