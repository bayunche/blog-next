const Router = require('koa-router')
const router = new Router({ prefix: '/api/category' })

const { getCategoryList } = require('../controllers/tag')

router.get('/', getCategoryList) // 获取分类列表

module.exports = router
