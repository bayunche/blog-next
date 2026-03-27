const Joi = require('joi')

// import models
const {
  article: ArticleModel,
  tag: TagModel,
  category: CategoryModel,
  comment: CommentModel,
  reply: ReplyModel,
  user: UserModel,
  record: RecordModel,
  sequelize,
} = require('../models')

const fs = require('fs')
const archiver = require('archiver')
const send = require('koa-send')
const { v4: uuidv4 } = require('uuid')
const { uploadPath, outputPath, findOrCreateFilePath, decodeFile, generateFile } = require('../utils/file')

const ABOUT_PAGE_TITLE = '\u5173\u4e8e\u9875\u9762'
const ABOUT_PAGE_PLACEHOLDER = '\u5173\u4e8e\u9875\u9762\u5360\u4f4d\u5185\u5bb9\uff0c\u8bf7\u52ff\u5220\u9664\u3002'
const CREATE_ARTICLE_EXISTS_MESSAGE = '\u521b\u5efa\u5931\u8d25\uff0c\u8be5\u6587\u7ae0\u5df2\u5b58\u5728\uff01'
const IMPORT_ARTICLES_SUCCESS_MESSAGE = '\u5bfc\u5165\u6587\u7ae0\u6210\u529f'
const GET_ARCHIVES_ERROR_MESSAGE = '\u83b7\u53d6\u5f52\u6863\u6570\u636e\u5931\u8d25'
const PREVIEW_LENGTH = 1000

const normalizeName = value => String(value || '').trim().replace(/\s+/g, ' ')

const normalizeNameList = list => {
  const source = Array.isArray(list) ? list : []
  const seen = new Set()

  return source
    .map(normalizeName)
    .filter(Boolean)
    .filter(name => {
      const key = name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

const normalizeRelationItems = items => {
  const source = Array.isArray(items) ? items : []
  const seen = new Set()

  return source
    .map(item => {
      if (!item) return null
      const raw = typeof item.toJSON === 'function' ? item.toJSON() : { ...item }
      const name = normalizeName(raw.name)
      if (!name) return null

      const key = name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)

      return { ...raw, name }
    })
    .filter(Boolean)
}

const normalizeArticlePayload = article => {
  if (!article) return article

  const raw = typeof article.toJSON === 'function' ? article.toJSON() : { ...article }
  const categories = normalizeRelationItems(raw.categories)
  const tags = normalizeRelationItems(raw.tags)
  const rawCategory = raw.category
  const directCategoryName = normalizeName(rawCategory && rawCategory.name)
  const category = directCategoryName
    ? {
        ...(rawCategory && typeof rawCategory.toJSON === 'function' ? rawCategory.toJSON() : rawCategory),
        name: directCategoryName,
      }
    : categories[0] || null

  return {
    ...raw,
    categories,
    category,
    tags,
  }
}

const buildNormalizedIncludeWhere = value => {
  const normalized = normalizeName(value).toLowerCase()
  if (!normalized) return undefined

  return sequelize.where(
    sequelize.fn('LOWER', sequelize.fn('TRIM', sequelize.col('name'))),
    normalized
  )
}

const buildTagInclude = where => {
  const include = {
    model: TagModel,
    attributes: ['id', 'name'],
    required: !!where,
  }

  if (where) include.where = where
  return include
}

const buildCategoryInclude = where => {
  const include = {
    model: CategoryModel,
    attributes: ['id', 'name'],
    required: !!where,
  }

  if (where) include.where = where
  return include
}

const buildCommentSummaryInclude = () => ({
  model: CommentModel,
  attributes: ['id'],
  required: false,
  include: [{ model: ReplyModel, attributes: ['id'], required: false }],
})

const buildDetailCommentInclude = () => ({
  model: CommentModel,
  attributes: ['id', 'content', 'createdAt'],
  include: [
    {
      model: ReplyModel,
      attributes: ['id', 'content', 'createdAt'],
      include: [{ model: UserModel, as: 'user', attributes: { exclude: ['updatedAt', 'password'] } }],
    },
    { model: UserModel, as: 'user', attributes: { exclude: ['updatedAt', 'password'] } },
  ],
  row: true,
})

const parseGithubProfile = user => {
  if (!user || typeof user.github !== 'string') return

  try {
    user.github = JSON.parse(user.github)
  } catch (error) {
    user.github = null
  }
}

const hydrateCommentUsers = comments => {
  const source = Array.isArray(comments) ? comments : []

  source.forEach(comment => {
    parseGithubProfile(comment.user)

    const replies = Array.isArray(comment.replies) ? comment.replies : []
    replies.forEach(reply => {
      parseGithubProfile(reply.user)
    })
  })
}

const parsePreviewFlag = value => {
  return String(value ?? '1') === '1'
}

const parseBooleanQuery = value => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') {
    if (value === 1) return true
    if (value === 0) return false
    return null
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true' || normalized === '1') return true
    if (normalized === 'false' || normalized === '0') return false
  }

  return null
}

const parseNumberQuery = (value, fallback) => {
  const parsed = parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

class ArticleController {
  static async initAboutPage() {
    const result = await ArticleModel.findOne({ where: { id: -1 } })
    if (!result) {
      await ArticleModel.create({
        id: -1,
        title: ABOUT_PAGE_TITLE,
        content: ABOUT_PAGE_PLACEHOLDER,
      })
    }
  }

  static async create(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      authorId: Joi.number().required(),
      title: Joi.string().required(),
      content: Joi.string(),
      cover: Joi.string().allow('', null),
      cardCover: Joi.string().allow('', null),
      description: Joi.string().allow('', null),
      categoryList: Joi.array(),
      tagList: Joi.array(),
      type: Joi.boolean(),
      top: Joi.boolean(),
      musicId: Joi.string().allow('', null),
      musicName: Joi.string().allow('', null),
    })

    if (validator) {
      const {
        title,
        content,
        cover,
        cardCover,
        description,
        categoryList = [],
        tagList = [],
        authorId,
        type,
        top,
        musicId,
        musicName,
      } = ctx.request.body
      const result = await ArticleModel.findOne({ where: { title } })

      if (result) {
        ctx.throw(403, CREATE_ARTICLE_EXISTS_MESSAGE)
        return
      }

      const tags = normalizeNameList(tagList).map(name => ({ name }))
      const categories = normalizeNameList(categoryList).map(name => ({ name }))
      const uuid = uuidv4().replace(/-/g, '')
      const data = await ArticleModel.create(
        { title, content, cover, cardCover, description, authorId, tags, categories, type, top, uuid, musicId, musicName },
        { include: [TagModel, CategoryModel] }
      )

      ctx.body = normalizeArticlePayload(data)
    }
  }

  static async findById(ctx) {
    const validator = ctx.validate(
      { ...ctx.params, ...ctx.query },
      {
        id: Joi.number().required(),
        type: Joi.number(),
      }
    )

    if (validator) {
      const data = await ArticleModel.findOne({
        where: { id: ctx.params.id },
        include: [
          buildTagInclude(),
          buildCategoryInclude(),
          buildDetailCommentInclude(),
        ],
        order: [[CommentModel, 'createdAt', 'DESC'], [[CommentModel, ReplyModel, 'createdAt', 'ASC']]],
        row: true,
      })

      if (!data) {
        ctx.body = null
        return
      }

      const viewType = parseNumberQuery(ctx.query.type, 1)
      if (viewType === 1) {
        await ArticleModel.update({ viewCount: Number(data.viewCount || 0) + 1 }, { where: { id: ctx.params.id } })
        await RecordModel.create({ articleId: ctx.params.id })
      }

      hydrateCommentUsers(data.comments)
      ctx.body = data.type ? normalizeArticlePayload(data) : null
    }
  }

  static async findByUUId(ctx) {
    const validator = ctx.validate(
      { ...ctx.params, ...ctx.query },
      {
        uuid: Joi.string().required(),
      }
    )

    if (validator) {
      const data = await ArticleModel.findOne({
        where: { uuid: ctx.params.uuid },
        include: [
          buildTagInclude(),
          buildCategoryInclude(),
          buildDetailCommentInclude(),
        ],
        row: true,
      })

      if (!data) {
        ctx.body = null
        return
      }

      const viewType = parseNumberQuery(ctx.query.type, 1)
      if (viewType === 1) {
        await ArticleModel.update({ viewCount: Number(data.viewCount || 0) + 1 }, { where: { id: data.id } })
        await RecordModel.create({ articleId: data.id })
      }

      hydrateCommentUsers(data.comments)
      ctx.body = normalizeArticlePayload(data)
    }
  }

  static async getList(ctx) {
    const validator = ctx.validate(ctx.query, {
      page: Joi.string(),
      pageSize: Joi.number(),
      keyword: Joi.string().allow(''),
      category: Joi.string(),
      tag: Joi.string(),
      preview: Joi.number(),
      order: Joi.string(),
      type: Joi.boolean(),
    })

    if (validator) {
      const { page = 1, pageSize = 10, preview = 1, keyword = '', tag, category, order } = ctx.query
      const pageValue = parseNumberQuery(page, 1)
      const pageSizeValue = parseNumberQuery(pageSize, 10)
      const previewEnabled = parsePreviewFlag(preview)
      const tagFilter = buildNormalizedIncludeWhere(tag)
      const categoryFilter = buildNormalizedIncludeWhere(category)
      const typeValue = parseBooleanQuery(ctx.query.type)

      let articleOrder = [['createdAt', 'DESC']]
      if (order) {
        articleOrder = [String(order).split(' ')]
      }

      const where = {
        id: {
          $not: -1,
        },
        $or: {
          title: {
            $like: `%${keyword}%`,
          },
          content: {
            $like: `%${keyword}%`,
          },
        },
      }

      if (typeValue !== null) {
        where.$and = {
          type: {
            $eq: typeValue,
          },
        }
      }

      const data = await ArticleModel.findAndCountAll({
        where,
        include: [
          buildTagInclude(tagFilter),
          buildCategoryInclude(categoryFilter),
          buildCommentSummaryInclude(),
        ],
        offset: (pageValue - 1) * pageSizeValue,
        limit: pageSizeValue,
        order: articleOrder,
        row: true,
        distinct: true,
      })

      if (previewEnabled) {
        data.rows.forEach(item => {
          if (item && typeof item.content === 'string') {
            item.content = item.content.slice(0, PREVIEW_LENGTH)
          }
        })
      }

      data.rows = data.rows.map(normalizeArticlePayload).sort((left, right) => Number(right.top || 0) - Number(left.top || 0))
      ctx.body = data
    }
  }

  static async update(ctx) {
    const validator = ctx.validate(
      {
        articleId: ctx.params.id,
        ...ctx.request.body,
      },
      {
        articleId: Joi.number().required(),
        title: Joi.string(),
        content: Joi.string(),
        cover: Joi.string().allow('', null),
        cardCover: Joi.string().allow('', null),
        description: Joi.string().allow('', null),
        categories: Joi.array(),
        tags: Joi.array(),
        type: Joi.boolean(),
        top: Joi.boolean(),
        musicId: Joi.string().allow('', null),
        musicName: Joi.string().allow('', null),
      }
    )

    if (validator) {
      const {
        title,
        content,
        cover,
        cardCover,
        description,
        categories = [],
        tags = [],
        type,
        top,
        musicId,
        musicName,
      } = ctx.request.body
      const articleId = parseInt(ctx.params.id, 10)
      const tagList = normalizeNameList(tags).map(name => ({ name, articleId }))
      const categoryList = normalizeNameList(categories).map(name => ({ name, articleId }))

      await ArticleModel.update({ title, content, cover, cardCover, description, type, top, musicId, musicName }, { where: { id: articleId } })
      await TagModel.destroy({ where: { articleId } })
      await TagModel.bulkCreate(tagList)
      await CategoryModel.destroy({ where: { articleId } })
      await CategoryModel.bulkCreate(categoryList)
      ctx.body = { type }
    }
  }

  static async delete(ctx) {
    const validator = ctx.validate(ctx.params, {
      id: Joi.number().required(),
    })

    if (validator) {
      const articleId = ctx.params.id
      await sequelize.query(
        `delete comment, reply, category, tag, article
        from article
        left join reply on article.id=reply.articleId
        left join comment on article.id=comment.articleId
        left join category on article.id=category.articleId
        left join tag on article.id=tag.articleId
        where article.id=${articleId}`
      )
      ctx.status = 204
    }
  }

  static async delList(ctx) {
    const validator = ctx.validate(ctx.params, {
      list: Joi.string().required(),
    })

    if (validator) {
      const list = ctx.params.list.split(',')
      await sequelize.query(
        `delete comment, reply, category, tag, article
        from article
        left join reply on article.id=reply.articleId
        left join comment on article.id=comment.articleId
        left join category on article.id=category.articleId
        left join tag on article.id=tag.articleId
        where article.id in (${list})`
      )
      ctx.status = 204
    }
  }

  static async checkExist(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      fileNameList: Joi.array().required(),
    })

    if (validator) {
      const { fileNameList } = ctx.request.body
      const list = await Promise.all(
        fileNameList.map(async fileName => {
          const filePath = `${uploadPath}/${fileName}`
          const file = decodeFile(filePath)
          const title = file.title || fileName.replace(/\.md/, '')

          try {
            const article = await ArticleModel.findOne({ where: { title }, attributes: ['id'] })
            const result = { fileName, title }
            if (article) {
              result.exist = true
              result.articleId = article.id
            }
            return result
          } catch (error) {
            return null
          }
        })
      )

      ctx.body = list.filter(Boolean)
    }
  }

  static async upload(ctx) {
    const file = ctx.request.files.file

    await findOrCreateFilePath(uploadPath)
    const upload = currentFile => {
      const reader = fs.createReadStream(currentFile.path)
      const fileName = currentFile.name
      const filePath = `${uploadPath}/${fileName}`
      const upStream = fs.createWriteStream(filePath)
      reader.pipe(upStream)
    }

    Array.isArray(file) ? file.forEach(item => upload(item)) : upload(file)
    ctx.status = 204
  }

  static async uploadConfirm(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      authorId: Joi.number(),
      uploadList: Joi.array(),
    })

    if (validator) {
      const { uploadList, authorId } = ctx.request.body
      await findOrCreateFilePath(uploadPath)

      const parseList = list => {
        return list.map(item => {
          const filePath = `${uploadPath}/${item.fileName}`
          const result = decodeFile(filePath)
          const { title, date, categories = [], tags = [], content } = result
          const data = {
            title: title || item.fileName.replace(/\.md/, ''),
            categories: categories.map(name => ({ name })),
            tags: tags.map(name => ({ name })),
            content,
            authorId,
          }

          if (date) data.createdAt = date
          if (item.articleId) data.articleId = item.articleId
          return data
        })
      }

      const list = parseList(uploadList)
      const updateList = list.filter(item => !!item.articleId)
      const insertList = list.filter(item => !item.articleId)

      const insertResultList = await Promise.all(
        insertList.map(data => ArticleModel.create(data, { include: [TagModel, CategoryModel] }))
      )

      const updateResultList = await Promise.all(
        updateList.map(async data => {
          const { title, content, categories = [], tags = [], articleId } = data
          await ArticleModel.update({ title, content }, { where: { id: articleId } })
          await TagModel.destroy({ where: { articleId } })
          await TagModel.bulkCreate(tags)
          await CategoryModel.destroy({ where: { articleId } })
          await CategoryModel.bulkCreate(categories)
          return ArticleModel.findOne({ where: { id: articleId } })
        })
      )

      ctx.body = { message: IMPORT_ARTICLES_SUCCESS_MESSAGE, insertList: insertResultList, updateList: updateResultList }
    }
  }

  static async output(ctx) {
    const validator = ctx.validate(ctx.params, {
      id: Joi.number().required(),
    })

    if (validator) {
      const article = await ArticleModel.findOne({
        where: { id: ctx.params.id },
        include: [
          buildTagInclude(),
          buildCategoryInclude(),
        ],
      })

      const { fileName } = await generateFile(article)
      ctx.attachment(decodeURI(fileName))
      await send(ctx, fileName, { root: outputPath })
    }
  }

  static async outputList(ctx) {
    const validator = ctx.validate(ctx.params, {
      list: Joi.string().required(),
    })

    if (validator) {
      const articleList = ctx.params.list.split(',')
      const list = await ArticleModel.findAll({
        where: {
          id: articleList,
        },
        include: [
          buildTagInclude(),
          buildCategoryInclude(),
        ],
      })

      await Promise.all(list.map(article => generateFile(article)))

      const zipName = 'mdFiles.zip'
      const zipStream = fs.createWriteStream(`${outputPath}/${zipName}`)
      const zip = archiver('zip')
      zip.pipe(zipStream)
      list.forEach(item => {
        zip.append(fs.createReadStream(`${outputPath}/${item.title}.md`), {
          name: `${item.title}.md`,
        })
      })
      await zip.finalize()

      ctx.attachment(decodeURI(zipName))
      await send(ctx, zipName, { root: outputPath })
    }
  }

  static async outputAll(ctx) {
    const list = await ArticleModel.findAll({
      where: {
        id: {
          $not: -1,
        },
      },
      include: [
        buildTagInclude(),
        buildCategoryInclude(),
      ],
    })

    await Promise.all(list.map(article => generateFile(article)))

    const zipName = 'mdFiles.zip'
    const zipStream = fs.createWriteStream(`${outputPath}/${zipName}`)
    const zip = archiver('zip')
    zip.pipe(zipStream)
    list.forEach(item => {
      zip.append(fs.createReadStream(`${outputPath}/${item.title}.md`), {
        name: `${item.title}.md`,
      })
    })
    await zip.finalize()

    ctx.attachment(decodeURI(zipName))
    await send(ctx, zipName, { root: outputPath })
  }

  static async getArchives(ctx) {
    try {
      const rawArticles = await ArticleModel.findAll({
        where: {
          id: {
            $not: -1,
          },
          type: true,
        },
        attributes: ['id', 'title', 'description', 'cover', 'cardCover', 'viewCount', 'likeCount', 'createdAt', 'updatedAt'],
        include: [
          buildTagInclude(),
          buildCategoryInclude(),
          { model: CommentModel, attributes: ['id'], required: false },
        ],
        order: [['createdAt', 'DESC']],
      })

      const articles = rawArticles.map(normalizeArticlePayload)
      const archiveMap = new Map()

      articles.forEach(article => {
        const date = new Date(article.createdAt)
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        if (!archiveMap.has(year)) {
          archiveMap.set(year, {
            year,
            count: 0,
            months: new Map(),
          })
        }

        const yearData = archiveMap.get(year)
        yearData.count += 1

        if (!yearData.months.has(month)) {
          yearData.months.set(month, {
            month,
            count: 0,
            articles: [],
          })
        }

        const monthData = yearData.months.get(month)
        monthData.count += 1
        monthData.articles.push({
          id: article.id,
          title: article.title,
          description: article.description,
          cover: article.cover,
          cardCover: article.cardCover,
          viewCount: article.viewCount,
          likeCount: article.likeCount,
          commentCount: Array.isArray(article.comments) ? article.comments.length : 0,
          category: Array.isArray(article.categories) ? article.categories[0] || null : null,
          tags: Array.isArray(article.tags) ? article.tags : [],
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        })
      })

      ctx.body = Array.from(archiveMap.values()).map(yearData => ({
        year: yearData.year,
        count: yearData.count,
        months: Array.from(yearData.months.values()).map(monthData => ({
          month: monthData.month,
          count: monthData.count,
          articles: monthData.articles,
        })),
      }))
    } catch (error) {
      console.error(GET_ARCHIVES_ERROR_MESSAGE, error)
      ctx.throw(500, GET_ARCHIVES_ERROR_MESSAGE)
    }
  }
}

module.exports = ArticleController
