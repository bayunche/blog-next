const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const error = require('koa-json-error')
const logger = require('koa-logger')

const authHandler = require('./middlewares/authHandler')
const context = require('./utils/context')
const { uploadPath } = require('./utils/file')
const loadRouter = require('./router')

const PUBLIC_UPLOAD_PREFIX = '/public/uploads/'

function createUploadMiddleware() {
  return async (ctx, next) => {
    if ((ctx.method !== 'GET' && ctx.method !== 'HEAD') || !ctx.path.startsWith(PUBLIC_UPLOAD_PREFIX)) {
      await next()
      return
    }

    const rawRelativePath = decodeURIComponent(ctx.path.slice(PUBLIC_UPLOAD_PREFIX.length))
    const safeRelativePath = rawRelativePath.replace(/\\/g, '/')
    const resolvedUploadRoot = path.resolve(uploadPath)
    const targetPath = path.resolve(uploadPath, safeRelativePath)

    if (!targetPath.startsWith(resolvedUploadRoot)) {
      ctx.status = 400
      return
    }

    if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
      await next()
      return
    }

    ctx.type = path.extname(targetPath)
    ctx.body = fs.createReadStream(targetPath)
  }
}

function createApp(options = {}) {
  const {
    routeLoader = loadRouter,
    authMiddleware = authHandler,
    enableLogger = true,
  } = options

  const app = new Koa()

  Object.keys(context).forEach(key => {
    app.context[key] = context[key]
  })

  app
    .use(cors())
    .use(
      koaBody({
        multipart: true,
        formidable: {
          keepExtensions: true,
          maxFileSize: 2000 * 1024 * 1024,
        }
      })
    )
    .use(
      error({
        postFormat: (err, { stack, ...rest }) => (process.env.NODE_ENV !== 'development' ? rest : { stack, ...rest })
      })
    )
    .use(createUploadMiddleware())
    .use(authMiddleware)

  if (enableLogger) {
    app.use(logger())
  }

  routeLoader(app)

  return app
}

module.exports = {
  createApp,
  createUploadMiddleware,
  PUBLIC_UPLOAD_PREFIX,
}
