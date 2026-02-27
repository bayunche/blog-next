const Router = require('koa-router')
const router = new Router({ prefix: '/category' })

const { getCategoryList, deleteCategory, updateCategory } = require('../controllers/tag')

router.get('/', getCategoryList) // 获取分类列表
router.delete('/:name', deleteCategory)
router.put('/:name', updateCategory)

module.exports = router
