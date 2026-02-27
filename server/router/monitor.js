const Router = require('koa-router')
const router = new Router({prefix: '/monitor'})
const {sysMonitor, summary} = require('../controllers/monitor')

router
  .get('/summary', summary)
  .get('/start', sysMonitor) 
module.exports = router
