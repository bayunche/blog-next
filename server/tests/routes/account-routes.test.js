const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')

const { createControllerMap } = require('../helpers/controllerStub')
const { createRouteTestApp, loadRouteModule } = require('../helpers/createRouteTestApp')
const { adminToken } = require('../helpers/testTokens')

const userControllers = createControllerMap([
  'login',
  'register',
  'getGithubOAuthConfig',
  'findUser',
  'getList',
  'updateUser',
  'delete',
  'getGithubContributions',
])

const tagControllers = createControllerMap([
  'getTagList',
  'getCategoryList',
])

const app = createRouteTestApp([
  loadRouteModule('../../router/home', {
    '../controllers/user': userControllers,
    '../controllers/tag': tagControllers,
  }),
  loadRouteModule('../../router/user', {
    '../controllers/user': userControllers,
  }),
])

test('home/auth endpoints are registered for public access', async () => {
  const login = await request(app.callback()).post('/login').send({})
  assert.equal(login.status, 200)
  assert.equal(login.body.handler, 'login')

  const register = await request(app.callback()).post('/register').send({})
  assert.equal(register.status, 200)
  assert.equal(register.body.handler, 'register')

  const oauthConfig = await request(app.callback()).get('/github/oauth/config')
  assert.equal(oauthConfig.status, 200)
  assert.equal(oauthConfig.body.handler, 'getGithubOAuthConfig')
})

test('user lookup and list routes stay public while destructive management routes require admin auth', async () => {
  const findUser = await request(app.callback()).get('/user/find/demo')
  assert.equal(findUser.status, 200)
  assert.equal(findUser.body.handler, 'findUser')

  const list = await request(app.callback()).get('/user/list')
  assert.equal(list.status, 200)
  assert.equal(list.body.handler, 'getList')

  const unauthenticatedDelete = await request(app.callback()).delete('/user/2')
  assert.equal(unauthenticatedDelete.status, 401)

  const authenticatedDelete = await request(app.callback())
    .delete('/user/2')
    .set('Authorization', adminToken())
  assert.equal(authenticatedDelete.status, 200)
  assert.equal(authenticatedDelete.body.handler, 'delete')

  const unauthenticatedUpdate = await request(app.callback()).put('/user/2').send({})
  assert.equal(unauthenticatedUpdate.status, 401)
})

test('tag/category list endpoints from home router remain public', async () => {
  const tags = await request(app.callback()).get('/tag/list')
  assert.equal(tags.status, 200)
  assert.equal(tags.body.handler, 'getTagList')

  const categories = await request(app.callback()).get('/category/list')
  assert.equal(categories.status, 200)
  assert.equal(categories.body.handler, 'getCategoryList')
})
