const Router = require('koa-router')
const router = new Router({ prefix: '/api' })
const { login, register, getGithubContributions, githubCallback } = require('../controllers/user')
const { getTagList, getCategoryList } = require('../controllers/tag')

// tag category
router.get('/tag/list', getTagList) // 获取所有的 tag 列表
router.get('/category/list', getCategoryList) // 获取 category 列表

// user
router.post('/login', login) // 登录
router.get('/login', login)
router.post('/register', register) // 注册
router.post('/oauth/github/callback', githubCallback) // GitHub OAuth 回调
router.get('/user/github/contributions', getGithubContributions)

module.exports = router
