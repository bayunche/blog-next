const Sequelize = require('sequelize')

const ARTICLE_COLUMNS = {
  cover: {
    type: Sequelize.STRING(500),
    allowNull: true,
    comment: 'cover image url',
  },
  description: {
    type: Sequelize.STRING(500),
    allowNull: true,
    comment: 'article description',
  },
  likeCount: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0,
    comment: 'like count',
  },
  musicId: {
    type: Sequelize.STRING(50),
    allowNull: true,
    comment: 'background music id',
  },
  musicName: {
    type: Sequelize.STRING(255),
    allowNull: true,
    comment: 'background music name',
  },
}

async function ensureArticleSchema(sequelize) {
  const queryInterface = sequelize.getQueryInterface()
  const table = await queryInterface.describeTable('article')

  for (const [columnName, definition] of Object.entries(ARTICLE_COLUMNS)) {
    if (table[columnName]) continue
    await queryInterface.addColumn('article', columnName, definition)
  }
}

module.exports = {
  ensureArticleSchema,
}
