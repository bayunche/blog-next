const proxyquire = require('proxyquire').noCallThru()

process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'test-secret'
process.env.TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '1h'
process.env.NODE_ENV = process.env.NODE_ENV || 'test'

function loadRouteModule(routeModulePath, stubs = {}) {
  return proxyquire(routeModulePath, stubs)
}

function createRouteTestApp(routes) {
  const { createApp } = require('../../createApp')

  return createApp({
    enableLogger: false,
    routeLoader: app => {
      routes.forEach(route => {
        app.use(route.routes()).use(route.allowedMethods())
      })
    },
  })
}

module.exports = {
  createRouteTestApp,
  loadRouteModule,
}
