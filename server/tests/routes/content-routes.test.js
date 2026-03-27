const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')

const { createControllerMap } = require('../helpers/controllerStub')
const { createRouteTestApp, loadRouteModule } = require('../helpers/createRouteTestApp')
const { adminToken } = require('../helpers/testTokens')

const articleControllers = createControllerMap([
  'create',
  'getList',
  'output',
  'upload',
  'checkExist',
  'uploadConfirm',
  'outputAll',
  'findById',
  'findByUUId',
  'update',
  'delete',
  'outputList',
  'delList',
  'getArchives',
])

const tagControllers = createControllerMap([
  'getTagList',
  'getPublicTagList',
  'getPublicTagDetail',
  'deleteTag',
  'updateTag',
  'getCategoryList',
  'getPublicCategoryList',
  'getPublicCategoryDetail',
  'deleteCategory',
  'updateCategory',
])

const app = createRouteTestApp([
  loadRouteModule('../../router/article', {
    '../controllers/article': articleControllers,
  }),
  loadRouteModule('../../router/tag', {
    '../controllers/tag': tagControllers,
  }),
  loadRouteModule('../../router/category', {
    '../controllers/tag': tagControllers,
  }),
])

test('article public endpoints respond through registered handlers', async () => {
  const list = await request(app.callback()).get('/article/list')
  assert.equal(list.status, 200)
  assert.equal(list.body.handler, 'getList')

  const archives = await request(app.callback()).get('/article/archives')
  assert.equal(archives.status, 200)
  assert.equal(archives.body.handler, 'getArchives')

  const detail = await request(app.callback()).get('/article/123')
  assert.equal(detail.status, 200)
  assert.equal(detail.body.handler, 'findById')

  const share = await request(app.callback()).get('/article/share/demo-uuid')
  assert.equal(share.status, 200)
  assert.equal(share.body.handler, 'findByUUId')
})

test('article protected endpoints reject unauthenticated requests and allow admin token', async () => {
  const unauthenticatedCreate = await request(app.callback()).post('/article').send({})
  assert.equal(unauthenticatedCreate.status, 401)

  const authenticatedCreate = await request(app.callback())
    .post('/article')
    .set('Authorization', adminToken())
    .send({})
  assert.equal(authenticatedCreate.status, 200)
  assert.equal(authenticatedCreate.body.handler, 'create')

  const unauthenticatedOutput = await request(app.callback()).get('/article/output/42')
  assert.equal(unauthenticatedOutput.status, 401)

  const authenticatedOutput = await request(app.callback())
    .get('/article/output/42')
    .query({ token: adminToken() })
  assert.equal(authenticatedOutput.status, 200)
  assert.equal(authenticatedOutput.body.handler, 'output')

  const authenticatedUpdate = await request(app.callback())
    .put('/article/42')
    .set('Authorization', adminToken())
    .send({})
  assert.equal(authenticatedUpdate.status, 200)
  assert.equal(authenticatedUpdate.body.handler, 'update')
})

test('tag and category public endpoints remain accessible', async () => {
  const publicTags = await request(app.callback()).get('/tag/public')
  assert.equal(publicTags.status, 200)
  assert.equal(publicTags.body.handler, 'getPublicTagList')

  const publicTagDetail = await request(app.callback()).get('/tag/public/frontend')
  assert.equal(publicTagDetail.status, 200)
  assert.equal(publicTagDetail.body.handler, 'getPublicTagDetail')

  const publicCategories = await request(app.callback()).get('/category/public')
  assert.equal(publicCategories.status, 200)
  assert.equal(publicCategories.body.handler, 'getPublicCategoryList')
})

test('tag and category management endpoints remain routable under the current contract', async () => {
  const tagDelete = await request(app.callback()).delete('/tag/demo')
  assert.equal(tagDelete.status, 200)
  assert.equal(tagDelete.body.handler, 'deleteTag')

  const categoryUpdate = await request(app.callback()).put('/category/demo').send({})
  assert.equal(categoryUpdate.status, 200)
  assert.equal(categoryUpdate.body.handler, 'updateCategory')
})
