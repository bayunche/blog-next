const Router = require('koa-router')
const router = new Router()
const { login, register, getGithubOAuthConfig } = require('../controllers/user')
const { getTagList, getCategoryList } = require('../controllers/tag')

// tag category
router.get('/tag/list', getTagList) // 获取所有的 tag 列表
router.get('/category/list', getCategoryList) // 获取 category 列表

// root
router.post('/login', login) // 登录
router.get('/login', login)
router.get('/github/oauth/config', getGithubOAuthConfig) // 获取 GitHub OAuth 前端配置
router.post('/register', register) // 注册

module.exports = router
