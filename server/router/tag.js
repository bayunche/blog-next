const Router = require('koa-router')
const router = new Router({ prefix: '/tag' })

const { getTagList, deleteTag, updateTag } = require('../controllers/tag')

router.get('/', getTagList) // 获取标签列表
router.delete('/:name', deleteTag)
router.put('/:name', updateTag)

module.exports = router
