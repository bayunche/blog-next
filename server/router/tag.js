const Router = require('koa-router')
const router = new Router({ prefix: '/tag' })

const {
  getTagList,
  getPublicTagList,
  getPublicTagDetail,
  deleteTag,
  updateTag,
} = require('../controllers/tag')

router.get('/public', getPublicTagList)
router.get('/public/:name', getPublicTagDetail)
router.get('/', getTagList) // 鑾峰彇鏍囩鍒楄〃
router.delete('/:name', deleteTag)
router.put('/:name', updateTag)

module.exports = router
