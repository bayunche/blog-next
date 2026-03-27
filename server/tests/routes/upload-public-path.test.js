const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const path = require('path')
const request = require('supertest')

const { createApp, createUploadMiddleware } = require('../../createApp')
const { uploadPath } = require('../../utils/file')

const articleMediaDir = path.join(uploadPath, 'article-media')
const fixtureFilePath = path.join(articleMediaDir, 'api-upload-fixture.txt')

test.before(() => {
  fs.mkdirSync(articleMediaDir, { recursive: true })
  fs.writeFileSync(fixtureFilePath, 'fixture-upload-content', 'utf8')
})

test.after(() => {
  if (fs.existsSync(fixtureFilePath)) {
    fs.unlinkSync(fixtureFilePath)
  }
})

test('public upload middleware serves existing files under the upload root', async () => {
  const app = createApp({ enableLogger: false, routeLoader: () => {} })
  const response = await request(app.callback()).get('/public/uploads/article-media/api-upload-fixture.txt')

  assert.equal(response.status, 200)
  assert.equal(response.text, 'fixture-upload-content')
})

test('public upload middleware rejects path traversal outside the upload root', async () => {
  const middleware = createUploadMiddleware()
  const ctx = {
    method: 'GET',
    path: '/public/uploads/../../package.json',
    status: 200,
  }

  let nextCalled = false
  await middleware(ctx, async () => {
    nextCalled = true
  })

  assert.equal(ctx.status, 400)
  assert.equal(nextCalled, false)
})
