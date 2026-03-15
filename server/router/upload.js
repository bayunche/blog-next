const Router = require('koa-router')

const router = new Router({ prefix: '/upload' })

const {
  uploadImage,
  uploadImages,
  uploadLocalImage,
} = require('../controllers/upload')

router
  .post('/image', uploadImage)
  .post('/image/local', uploadLocalImage)
  .post('/images', uploadImages)

module.exports = router
