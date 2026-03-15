const Router = require('koa-router')
const router = new Router({ prefix: '/category' })

const {
  getCategoryList,
  getPublicCategoryList,
  getPublicCategoryDetail,
  deleteCategory,
  updateCategory,
} = require('../controllers/tag')

router.get('/public', getPublicCategoryList)
router.get('/public/:name', getPublicCategoryDetail)
router.get('/', getCategoryList) // 鑾峰彇鍒嗙被鍒楄〃
router.delete('/:name', deleteCategory)
router.put('/:name', updateCategory)

module.exports = router
