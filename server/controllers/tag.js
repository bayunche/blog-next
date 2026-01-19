// import models
const { tag: TagModel, category: CategoryModel, sequelize } = require('../models')

class TagController {
  static async getTagList(ctx) {
    const data = await TagModel.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name',
      where: {
        articleId: { $not: null }
      },
      order: [[sequelize.fn('COUNT', sequelize.col('name')), 'desc']]
    })

    ctx.body = data
  }

  static async getCategoryList(ctx) {
    const data = await CategoryModel.findAll({
      attributes: ['name', [sequelize.fn('COUNT', sequelize.col('name')), 'count']],
      group: 'name',
      where: {
        articleId: { $not: null }
      },
      order: [[sequelize.fn('COUNT', sequelize.col('name')), 'desc']]
    })

    ctx.body = data
  }

  // Delete tag by name (removes from all articles)
  static async deleteTag(ctx) {
    const { name } = ctx.params
    await TagModel.destroy({ where: { name } })
    ctx.status = 204
  }

  // Delete category by name
  static async deleteCategory(ctx) {
    const { name } = ctx.params
    await CategoryModel.destroy({ where: { name } })
    ctx.status = 204
  }

  // Rename tag
  static async updateTag(ctx) {
    const { name } = ctx.params
    const { newName } = ctx.request.body
    await TagModel.update({ name: newName }, { where: { name } })
    ctx.status = 204
  }

  // Rename category
  static async updateCategory(ctx) {
    const { name } = ctx.params
    const { newName } = ctx.request.body
    await CategoryModel.update({ name: newName }, { where: { name } })
    ctx.status = 204
  }
}

module.exports = TagController
