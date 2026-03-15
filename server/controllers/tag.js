// import models
const { tag: TagModel, category: CategoryModel } = require('../models')
const {
  buildNormalizedWhere,
  getPublicCategoryDetail,
  getPublicCategorySummaries,
  getPublicTagDetail,
  getPublicTagSummaries,
  normalizeName,
} = require('../utils/taxonomy')

const aggregateNameList = rows => {
  const merged = new Map()

  ;(rows || []).forEach(item => {
    const raw = typeof item.toJSON === 'function' ? item.toJSON() : item
    const normalizedName = normalizeName(raw.name)
    if (!normalizedName) return

    const key = normalizedName.toLowerCase()
    const current = merged.get(key)
    if (current) {
      current.count += 1
      return
    }

    merged.set(key, {
      name: normalizedName,
      count: 1,
    })
  })

  return Array.from(merged.values()).sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, 'zh-Hans-CN'))
}

class TagController {
  static async getTagList(ctx) {
    const data = await TagModel.findAll({
      attributes: ['name'],
      where: {
        articleId: { $not: null }
      },
      order: [['name', 'ASC']]
    })

    ctx.body = aggregateNameList(data)
  }

  static async getPublicTagList(ctx) {
    ctx.body = await getPublicTagSummaries()
  }

  static async getCategoryList(ctx) {
    const data = await CategoryModel.findAll({
      attributes: ['name'],
      where: {
        articleId: { $not: null }
      },
      order: [['name', 'ASC']]
    })

    ctx.body = aggregateNameList(data)
  }

  static async getPublicCategoryList(ctx) {
    ctx.body = await getPublicCategorySummaries()
  }

  static async getPublicTagDetail(ctx) {
    ctx.body = await getPublicTagDetail(ctx.params.name, ctx.query)
  }

  static async getPublicCategoryDetail(ctx) {
    ctx.body = await getPublicCategoryDetail(ctx.params.name, ctx.query)
  }

  static async deleteTag(ctx) {
    const { name } = ctx.params
    await TagModel.destroy({ where: buildNormalizedWhere(name) })
    ctx.status = 204
  }

  static async deleteCategory(ctx) {
    const { name } = ctx.params
    await CategoryModel.destroy({ where: buildNormalizedWhere(name) })
    ctx.status = 204
  }

  static async updateTag(ctx) {
    const { name } = ctx.params
    const newName = normalizeName(ctx.request.body && ctx.request.body.newName)
    if (!newName) ctx.throw(400, '标签名不能为空')

    await TagModel.update({ name: newName }, { where: buildNormalizedWhere(name) })
    ctx.status = 204
  }

  static async updateCategory(ctx) {
    const { name } = ctx.params
    const newName = normalizeName(ctx.request.body && ctx.request.body.newName)
    if (!newName) ctx.throw(400, '分类名不能为空')

    await CategoryModel.update({ name: newName }, { where: buildNormalizedWhere(name) })
    ctx.status = 204
  }
}

module.exports = TagController
