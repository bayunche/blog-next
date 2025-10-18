const Joi = require('joi')
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid')

const {
  article: ArticleModel,
  tag: TagModel,
  category: CategoryModel,
  comment: CommentModel,
  sequelize,
} = require('../models')

const mapArticleToManageItem = (article) => {
  const firstCategory = Array.isArray(article.categories) ? article.categories[0] : null
  const tags = Array.isArray(article.tags)
    ? article.tags.map((tag) => ({ id: tag.id, name: tag.name }))
    : []

  return {
    id: article.id,
    title: article.title,
    summary: article.description || '',
    content: article.content || '',
    coverImage: article.cover || '',
    category: firstCategory ? { id: firstCategory.id, name: firstCategory.name } : undefined,
    tags,
    status: article.type ? 'published' : 'draft',
    viewCount: Number(article.viewCount || 0),
    likeCount: Number(article.likeCount || 0),
    commentCount: Array.isArray(article.comments) ? article.comments.length : 0,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  }
}

const resolveCategoryName = async (categoryId, categoryName) => {
  if (categoryName) {
    return categoryName.trim()
  }

  if (categoryId) {
    const category = await CategoryModel.findByPk(categoryId)
    if (category) {
      return category.name
    }
  }

  return null
}

const resolveTagNames = async (tagIds = [], tagNames = []) => {
  const names = new Set(
    (Array.isArray(tagNames) ? tagNames : [])
      .map((name) => (typeof name === 'string' ? name.trim() : ''))
      .filter(Boolean)
  )

  if (Array.isArray(tagIds) && tagIds.length > 0) {
    const records = await TagModel.findAll({ where: { id: tagIds } })
    records.forEach((tag) => {
      if (tag?.name) {
        names.add(tag.name)
      }
    })
  }

  return Array.from(names)
}

class AdminArticleController {
  static async list(ctx) {
    ctx.validate(
      { ...ctx.request.query },
      {
        page: Joi.number().integer().min(1).default(1),
        pageSize: Joi.number().integer().min(1).max(100).default(10),
        keyword: Joi.string().allow('', null),
        categoryId: Joi.number().integer().allow(null),
        tagId: Joi.number().integer().allow(null),
        status: Joi.string().valid('draft', 'published').allow(null),
      }
    )

    const { page = 1, pageSize = 10, keyword, categoryId, tagId, status } = ctx.request.query

    const where = {}
    if (keyword) {
      where.title = { [Op.like]: `%${keyword}%` }
    }
    if (status) {
      where.type = status === 'published'
    }

    const include = [
      {
        model: CategoryModel,
        attributes: ['id', 'name'],
        required: Boolean(categoryId),
        ...(categoryId ? { where: { id: Number(categoryId) } } : {}),
      },
      {
        model: TagModel,
        attributes: ['id', 'name'],
        required: Boolean(tagId),
        ...(tagId ? { where: { id: Number(tagId) } } : {}),
      },
      {
        model: CommentModel,
        attributes: ['id'],
      },
    ]

    const limit = Number(pageSize)
    const offset = (Number(page) - 1) * limit

    const { rows, count } = await ArticleModel.findAndCountAll({
      where,
      include,
      distinct: true,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    })

    const list = rows.map(mapArticleToManageItem)

    ctx.body = {
      list,
      total: count,
      page: Number(page),
      pageSize: limit,
    }
  }

  static async detail(ctx) {
    ctx.validate({ ...ctx.params }, { id: Joi.number().integer().required() })

    const id = Number(ctx.params.id)
    const article = await ArticleModel.findOne({
      where: { id },
      include: [
        { model: CategoryModel, attributes: ['id', 'name'] },
        { model: TagModel, attributes: ['id', 'name'] },
        { model: CommentModel, attributes: ['id'] },
      ],
    })

    if (!article) {
      ctx.throw(404, '文章不存在')
    }

    ctx.body = mapArticleToManageItem(article)
  }

  static async create(ctx) {
    ctx.validate(ctx.request.body, {
      title: Joi.string().required(),
      content: Joi.string().allow('', null),
      summary: Joi.string().allow('', null),
      coverImage: Joi.string().allow('', null),
      categoryId: Joi.number().integer().allow(null),
      categoryName: Joi.string().allow('', null),
      tagIds: Joi.array().items(Joi.number().integer()).allow(null),
      tagNames: Joi.array().items(Joi.string()).allow(null),
      status: Joi.string().valid('draft', 'published').default('draft'),
    })

    const {
      title,
      content,
      summary,
      coverImage,
      categoryId,
      categoryName,
      tagIds = [],
      tagNames = [],
      status,
    } = ctx.request.body

    const authorId = ctx.state.user?.id || 1

    const resolvedCategoryName = await resolveCategoryName(categoryId, categoryName)
    const resolvedTagNames = await resolveTagNames(tagIds, tagNames)

    const article = await ArticleModel.create(
      {
        title,
        content,
        description: summary,
        cover: coverImage,
        authorId,
        type: status === 'published',
        tags: resolvedTagNames.map((name) => ({ name })),
        categories: resolvedCategoryName ? [{ name: resolvedCategoryName }] : [],
        uuid: uuidv4().replace(/-/g, ''),
      },
      {
        include: [TagModel, CategoryModel],
      }
    )

    const created = await ArticleModel.findOne({
      where: { id: article.id },
      include: [
        { model: CategoryModel, attributes: ['id', 'name'] },
        { model: TagModel, attributes: ['id', 'name'] },
        { model: CommentModel, attributes: ['id'] },
      ],
    })

    ctx.body = mapArticleToManageItem(created)
  }

  static async update(ctx) {
    ctx.validate({ ...ctx.params }, { id: Joi.number().integer().required() })
    ctx.validate(ctx.request.body, {
      title: Joi.string().required(),
      content: Joi.string().allow('', null),
      summary: Joi.string().allow('', null),
      coverImage: Joi.string().allow('', null),
      categoryId: Joi.number().integer().allow(null),
      categoryName: Joi.string().allow('', null),
      tagIds: Joi.array().items(Joi.number().integer()).allow(null),
      tagNames: Joi.array().items(Joi.string()).allow(null),
      status: Joi.string().valid('draft', 'published').default('draft'),
    })

    const id = Number(ctx.params.id)
    const {
      title,
      content,
      summary,
      coverImage,
      categoryId,
      categoryName,
      tagIds = [],
      tagNames = [],
      status,
    } = ctx.request.body

    const resolvedCategoryName = await resolveCategoryName(categoryId, categoryName)
    const resolvedTagNames = await resolveTagNames(tagIds, tagNames)

    const transaction = await sequelize.transaction()
    try {
      await ArticleModel.update(
        {
          title,
          content,
          description: summary,
          cover: coverImage,
          type: status === 'published',
        },
        { where: { id }, transaction }
      )

      await TagModel.destroy({ where: { articleId: id }, transaction })
      await CategoryModel.destroy({ where: { articleId: id }, transaction })

      if (resolvedTagNames.length > 0) {
        await TagModel.bulkCreate(
          resolvedTagNames.map((name) => ({ name, articleId: id })),
          { transaction }
        )
      }

      if (resolvedCategoryName) {
        await CategoryModel.create({ name: resolvedCategoryName, articleId: id }, { transaction })
      }

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.error('更新文章失败:', error)
      ctx.throw(500, '更新文章失败')
    }

    const updated = await ArticleModel.findOne({
      where: { id },
      include: [
        { model: CategoryModel, attributes: ['id', 'name'] },
        { model: TagModel, attributes: ['id', 'name'] },
        { model: CommentModel, attributes: ['id'] },
      ],
    })

    ctx.body = mapArticleToManageItem(updated)
  }

  static async remove(ctx) {
    ctx.validate({ ...ctx.params }, { id: Joi.number().integer().required() })
    const id = Number(ctx.params.id)

    const transaction = await sequelize.transaction()
    try {
      await Promise.all([
        TagModel.destroy({ where: { articleId: id }, transaction }),
        CategoryModel.destroy({ where: { articleId: id }, transaction }),
        CommentModel.destroy({ where: { articleId: id }, transaction }),
      ])
      await ArticleModel.destroy({ where: { id }, transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.error('删除文章失败:', error)
      ctx.throw(500, '删除文章失败')
    }

    ctx.status = 204
  }

  static async batchDelete(ctx) {
    ctx.validate(ctx.request.body, {
      ids: Joi.array().items(Joi.number().integer()).min(1).required(),
    })

    const { ids } = ctx.request.body

    const transaction = await sequelize.transaction()
    try {
      await Promise.all([
        TagModel.destroy({ where: { articleId: ids }, transaction }),
        CategoryModel.destroy({ where: { articleId: ids }, transaction }),
        CommentModel.destroy({ where: { articleId: ids }, transaction }),
      ])
      await ArticleModel.destroy({ where: { id: ids }, transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      console.error('批量删除文章失败:', error)
      ctx.throw(500, '批量删除失败')
    }

    ctx.body = { message: `已删除 ${ids.length} 篇文章` }
  }

  static async publish(ctx) {
    ctx.validate({ ...ctx.params }, { id: Joi.number().integer().required() })
    const id = Number(ctx.params.id)
    await ArticleModel.update({ type: true }, { where: { id } })
    ctx.body = { message: '发布成功' }
  }

  static async unpublish(ctx) {
    ctx.validate({ ...ctx.params }, { id: Joi.number().integer().required() })
    const id = Number(ctx.params.id)
    await ArticleModel.update({ type: false }, { where: { id } })
    ctx.body = { message: '已转为草稿' }
  }

  static async batchPublish(ctx) {
    ctx.validate(ctx.request.body, {
      ids: Joi.array().items(Joi.number().integer()).min(1).required(),
    })

    const { ids } = ctx.request.body
    await ArticleModel.update({ type: true }, { where: { id: ids } })
    ctx.body = { message: `已发布 ${ids.length} 篇文章` }
  }

  static async batchUpdateStatus(ctx) {
    ctx.validate(ctx.request.body, {
      ids: Joi.array().items(Joi.number().integer()).min(1).required(),
      type: Joi.boolean().optional(),
      top: Joi.boolean().optional()
    })
    
    const { ids, type, top } = ctx.request.body
    const updateData = {}
    
    if (typeof type === 'boolean') {
      updateData.type = type  // 公开/私密
    }
    if (typeof top === 'boolean') {
      updateData.top = top    // 置顶/取消置顶
    }
    
    await ArticleModel.update(updateData, { where: { id: ids } })
    ctx.body = { message: `已更新 ${ids.length} 篇文章状态` }
  }
}

module.exports = AdminArticleController
