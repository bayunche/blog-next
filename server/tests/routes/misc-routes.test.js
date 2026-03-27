const test = require('node:test')
const assert = require('node:assert/strict')
const request = require('supertest')

const { createControllerMap } = require('../helpers/controllerStub')
const { createRouteTestApp, loadRouteModule } = require('../helpers/createRouteTestApp')
const { adminToken, userToken } = require('../helpers/testTokens')

const discussControllers = createControllerMap(['create', 'getList', 'deleteComment', 'deleteReply'])
const fragmentControllers = createControllerMap(['fetchFragmentList', 'create', 'findFragmentById', 'deleteFragment', 'updateFragment'])
const monitorControllers = createControllerMap(['sysMonitor', 'summary'])
const recordControllers = createControllerMap(['fetchRecordByDay'])
const uploadControllers = createControllerMap(['uploadImage', 'uploadImages', 'uploadLocalImage'])

const app = createRouteTestApp([
  loadRouteModule('../../router/discuss', {
    '../controllers/discuss': discussControllers,
  }),
  loadRouteModule('../../router/fragment', {
    '../controllers/fragment': fragmentControllers,
  }),
  loadRouteModule('../../router/monitor', {
    '../controllers/monitor': monitorControllers,
  }),
  loadRouteModule('../../router/record', {
    '../controllers/record': recordControllers,
  }),
  loadRouteModule('../../router/upload', {
    '../controllers/upload': uploadControllers,
  }),
])

test('utility read endpoints remain public', async () => {
  const discuss = await request(app.callback()).get('/discuss')
  assert.equal(discuss.status, 200)
  assert.equal(discuss.body.handler, 'getList')

  const fragments = await request(app.callback()).get('/fragment/list')
  assert.equal(fragments.status, 200)
  assert.equal(fragments.body.handler, 'fetchFragmentList')

  const record = await request(app.callback()).get('/record')
  assert.equal(record.status, 200)
  assert.equal(record.body.handler, 'fetchRecordByDay')
})

test('discuss create allows authenticated user token and rejects anonymous calls', async () => {
  const unauthenticated = await request(app.callback()).post('/discuss').send({})
  assert.equal(unauthenticated.status, 401)

  const authenticated = await request(app.callback())
    .post('/discuss')
    .set('Authorization', userToken())
    .send({})
  assert.equal(authenticated.status, 200)
  assert.equal(authenticated.body.handler, 'create')
})

test('fragment, monitor, and upload management routes require admin auth', async () => {
  const unauthenticatedFragmentCreate = await request(app.callback()).post('/fragment/create').send({})
  assert.equal(unauthenticatedFragmentCreate.status, 401)

  const authenticatedFragmentCreate = await request(app.callback())
    .post('/fragment/create')
    .set('Authorization', adminToken())
    .send({})
  assert.equal(authenticatedFragmentCreate.status, 200)
  assert.equal(authenticatedFragmentCreate.body.handler, 'create')

  const monitorSummary = await request(app.callback())
    .get('/monitor/summary')
    .set('Authorization', adminToken())
  assert.equal(monitorSummary.status, 200)
  assert.equal(monitorSummary.body.handler, 'summary')

  const uploadImage = await request(app.callback())
    .post('/upload/image')
    .set('Authorization', adminToken())
    .send({})
  assert.equal(uploadImage.status, 200)
  assert.equal(uploadImage.body.handler, 'uploadImage')
})
