const Router = require('koa-router')
const router = new Router({ prefix: '/article' })

const {
  create,
  getList,
  output,
  upload,
  checkExist,
  uploadConfirm,
  outputAll,
  findById,
  findByUUId,
  update,
  delete: del,
  outputList,
  delList,
  getArchives,
} = require('../controllers/article')

router
  .post('/', create) // 创建文章
  .get('/list', getList) // 获取文章列表
  .get('/archives', getArchives) // 获取归档数据
  .get('/md/:id', output) // 导出指定文章 markdown
  .post('/upload', upload) // 上传文章文件
  .post('/checkExist', checkExist) // 检查文章是否已存在
  .post('/upload/confirm', uploadConfirm) // 确认导入上传的文章文件
  .get('/output/all', outputAll) // 导出全部文章
  .get('/output/:id', output) // 导出单篇文章
  .get('/output/list/:list', outputList) // 批量导出指定文章
  .get('/share/:uuid', findByUUId) // view from share link
  .get('/:id', findById) // 获取文章详情
  .put('/:id', update) // 更新文章
  .delete('/list/:list', delList) // 批量删除文章
  .delete('/:id', del) // 删除单篇文章

module.exports = router
