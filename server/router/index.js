const fs = require('fs')

module.exports = (app) => {
  // 添加健康检查路由
  const Router = require('koa-router')
  const healthRouter = new Router()
  healthRouter.get('/health', (ctx) => {
    ctx.body = { status: 'OK', timestamp: new Date().toISOString() }
  })
  app.use(healthRouter.routes()).use(healthRouter.allowedMethods())

  // 自动加载所有路由文件
  const routeFiles = fs.readdirSync(__dirname).filter(file => file !== 'index.js')
  console.log('[ROUTER] Loading route files:', routeFiles)
  
  routeFiles.forEach(file => {
    try {
      const route = require(`./${file}`)
      app.use(route.routes()).use(route.allowedMethods())
      console.log('[ROUTER] Successfully loaded route:', file)
    } catch (error) {
      console.error('[ROUTER] Failed to load route:', file, error.message)
    }
  })
  
  console.log('[ROUTER] All routes loaded successfully')
}