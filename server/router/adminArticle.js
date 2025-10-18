const Router = require('koa-router')
const router = new Router({ prefix: '/api/admin/article' })
const AdminArticleController = require('../controllers/adminArticle')

router.get('/list', AdminArticleController.list)
router.get('/:id', AdminArticleController.detail)
router.post('/', AdminArticleController.create)
router.put('/:id', AdminArticleController.update)
router.delete('/:id', AdminArticleController.remove)
router.post('/batch-delete', AdminArticleController.batchDelete)
router.post('/batch-publish', AdminArticleController.batchPublish)
router.put('/batch-status', AdminArticleController.batchUpdateStatus)
router.put('/:id/publish', AdminArticleController.publish)
router.put('/:id/unpublish', AdminArticleController.unpublish)

module.exports = router
