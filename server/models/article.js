const moment = require('moment')
// article 鐞?
module.exports = (sequelize, dataTypes) => {
  const Article = sequelize.define(
    'article',
    {
      id: { type: dataTypes.INTEGER(11), primaryKey: true, autoIncrement: true },
      title: { type: dataTypes.STRING(255), allowNull: false, unique: true },
      content: { type: dataTypes.TEXT },
      cardCover: { type: dataTypes.STRING(500), allowNull: true },
      cover: { type: dataTypes.STRING(500), allowNull: true }, // 鐏忎線娼伴崶鍓уURL
      description: { type: dataTypes.STRING(500), allowNull: true }, // 閺傚洨鐝烽幓蹇氬牚
      viewCount: { type: dataTypes.INTEGER(11), defaultValue: 0 }, // 闂冨懓顕伴弫?
      likeCount: { type: dataTypes.INTEGER(11), defaultValue: 0 }, // 閻愮绂愰弫?
      type: { type: dataTypes.BOOLEAN, defaultValue: true }, // 閺勵垰鎯佺粔浣哥槕
      top: { type: dataTypes.BOOLEAN, defaultValue: false },
      musicId: { type: dataTypes.STRING(50), allowNull: true }, // 閼冲本娅欓棅鍏呯 ID
      musicName: { type: dataTypes.STRING(255), allowNull: true }, // 閼冲本娅欓棅鍏呯閸氬秶袨
      uuid: {
        type: dataTypes.STRING(32),
        allowNull: true,
      },
      createdAt: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      updatedAt: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        get() {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
    {
      timestamps: true
    }
  )

  Article.associate = models => {
    Article.hasMany(models.tag)
    Article.hasMany(models.category)
    Article.hasMany(models.comment)
    Article.hasMany(models.reply)
  }

  return Article
}
