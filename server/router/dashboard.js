const Router = require('koa-router')
const router = new Router({ prefix: '/api/admin/dashboard' })
const DashboardController = require('../controllers/dashboard')

router.get('/overview', DashboardController.getOverview)
router.get('/article-trend', DashboardController.getArticleTrend)

module.exports = router
