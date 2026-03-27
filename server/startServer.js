require('dotenv').config()

const config = require('./config')
const db = require('./models')
const { ensureArticleSchema } = require('./utils/ensureSchema')
const { createApp } = require('./createApp')

function startServer(options = {}) {
  const {
    port = config.PORT,
    createAppOptions,
  } = options

  const app = createApp(createAppOptions)
  const server = app.listen(port, () => {
    db.sequelize
      .sync({ force: false })
      .then(async () => {
        await ensureArticleSchema(db.sequelize)
        const initData = require('./initData')
        initData()
        console.log('sequelize connect success')
        console.log(`server listen on http://127.0.0.1:${port}`)
      })
      .catch(err => {
        console.log(err)
      })
  })

  return { app, server }
}

module.exports = {
  startServer,
}
