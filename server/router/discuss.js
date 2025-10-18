const Router = require('koa-router')
const router = new Router({ prefix: '/api/discuss' })
const { create, getList, deleteComment, deleteReply } = require('../controllers/discuss')

router
  .get('/', getList) // 获取评论列表
  .post('/', create) // 创建评论或者回复 articleId 文章 id
  .delete('/comment/:commentId', deleteComment) // 删除一级评论
  .delete('/reply/:replyId', deleteReply) // 删除回复

module.exports = router
