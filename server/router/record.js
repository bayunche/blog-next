const Router = require('koa-router')
const router = new Router({prefix: '/api/record'})
const {fetchRecordByDay} = require('../controllers/record')

router
  .get('/', fetchRecordByDay) 
module.exports = router
