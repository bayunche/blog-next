process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'test-secret'
process.env.TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '1h'

const { createToken } = require('../../utils/token')

function adminToken() {
  return `Bearer ${createToken({ userId: 1, role: 1, username: 'admin' })}`
}

function userToken() {
  return `Bearer ${createToken({ userId: 2, role: 2, username: 'user' })}`
}

module.exports = {
  adminToken,
  userToken,
}
