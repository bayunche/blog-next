function createControllerStub(name) {
  return async ctx => {
    ctx.status = 200
    ctx.body = {
      ok: true,
      handler: name,
      method: ctx.method,
      path: ctx.path,
    }
  }
}

function createControllerMap(names = []) {
  return names.reduce((acc, name) => {
    acc[name] = createControllerStub(name)
    return acc
  }, {})
}

module.exports = {
  createControllerStub,
  createControllerMap,
}
