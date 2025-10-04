const Router = require('koa-router')
const router = new Router({ prefix: '/tag' })

const { getTagList } = require('../controllers/tag')

router.get('/', getTagList) // 获取标签列表

module.exports = router
