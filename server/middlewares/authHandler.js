const { checkToken } = require('../utils/token')

/**
 * role === 1 requires administrator access.
 */
const verifyList1 = [
  { regexp: /\/article\/output/, required: 'get', verifyTokenBy: 'url' },
  { regexp: /\/article/, required: 'post, put, delete' },
  { regexp: /\/fragment/, required: 'post, put, delete' },
  { regexp: /\/discuss/, required: 'delete, post' },
  { regexp: /\/user/, required: 'put, delete' },
  { regexp: /\/monitor/, required: 'get' },
  { regexp: /\/music\/admin/, required: 'all' },
  { regexp: /\/upload/, required: 'post' },
]

/**
 * role === 2 requires an authenticated user.
 */
const verifyList2 = [
  { regexp: /\/discuss/, required: 'post' },
]

function checkAuth(method, url) {
  const normalizedMethod = String(method || '').toUpperCase()

  const matchRule = list =>
    list.find(item => item.regexp.test(url) && (item.required === 'all' || item.required.toUpperCase().includes(normalizedMethod)))

  const roleList = []
  const result1 = matchRule(verifyList1)
  const result2 = matchRule(verifyList2)

  if (result1) {
    roleList.push({ role: 1, verifyTokenBy: result1.verifyTokenBy || 'headers' })
  }

  if (result2) {
    roleList.push({ role: 2, verifyTokenBy: result2.verifyTokenBy || 'headers' })
  }

  return roleList
}

module.exports = async (ctx, next) => {
  const roleList = checkAuth(ctx.method, ctx.url)

  if (roleList.length > 0) {
    if (checkToken(ctx, roleList)) {
      await next()
      return
    }

    ctx.throw(401)
    return
  }

  await next()
}
