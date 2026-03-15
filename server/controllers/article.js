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
const { uploadPath, outputPath, findOrCreateFilePath, decodeFile, generateFile } = require('../utils/file')
const archiver = require('archiver') // 閹垫挸瀵?zip
const send = require('koa-send') // 閺傚洣娆㈡稉瀣祰
const { v4: uuidv4, stringify } = require('uuid')

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
      if (seen.has(key)) return null
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
  const directCategoryName = normalizeName(raw.category && raw.category.name)
  const category = directCategoryName
    ? { ...(typeof raw.category?.toJSON === 'function' ? raw.category.toJSON() : raw.category), name: directCategoryName }
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

class ArticleController {
  // 閸掓繂顫愰崠鏍ㄦ殶閹?閸忓厖绨い鐢告桨閿涘牏鏁ゆ禍搴ょ槑鐠佸搫鍙ч懕鏃撶礆
  static async initAboutPage() {
    const result = await ArticleModel.findOne({ where: { id: -1 } })
    if (!result) {
      ArticleModel.create({
        id: -1,
        title: '閸忓厖绨い鐢告桨',
        content: '閸忓厖绨い鐢告桨鐎涙ɑ銆傞敍灞藉瑏閸?,
      })
    }
  }

  // 閸掓稑缂撻弬鍥╃彿
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
      const { title, content, cover, cardCover, description, categoryList = [], tagList = [], authorId, type, top, musicId, musicName } = ctx.request.body
      const result = await ArticleModel.findOne({ where: { title } })
      if (result) {
        ctx.throw(403, '閸掓稑缂撴径杈Е閿涘矁顕氶弬鍥╃彿瀹告彃鐡ㄩ崷顭掔磼')
      } else {
        const tags = normalizeNameList(tagList).map(t => ({ name: t }))
        const categories = normalizeNameList(categoryList).map(c => ({ name: c }))
        const uuid = uuidv4().toString().replace(/-/g, '')
        const data = await ArticleModel.create(
          { title, content, cover, cardCover, description, authorId, tags, categories, type, top, uuid, musicId, musicName },
          { include: [TagModel, CategoryModel] }
        )
        ctx.body = normalizeArticlePayload(data)
      }
    }
  }

  // 閼惧嘲褰囬弬鍥╃彿鐠囷附鍎?  static async findById(ctx) {
    const validator = ctx.validate(
      { ...ctx.params, ...ctx.query },
      {
        id: Joi.number().required(),
        type: Joi.number(), // type 閻劋绨崠鍝勫瀻閺勵垰鎯佹晶鐐插濞村繗顫嶅▎鈩冩殶 1 閺傛澘顤冨ù蹇氼潔濞嗏剝鏆?0 娑撳秵鏌婃晶?      }
    )
    if (validator) {
      const data = await ArticleModel.findOne({
        where: { id: ctx.params.id },
        include: [
          // 閺屻儲澹?閸掑棛琚?閺嶅洨顒?鐠囧嫯顔?閸ョ偛顦?..
          { model: TagModel, attributes: ['id', 'name'] },
          { model: CategoryModel, attributes: ['id', 'name'] },
          {
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
          },
        ],
        order: [[CommentModel, 'createdAt', 'DESC'], [[CommentModel, ReplyModel, 'createdAt', 'ASC']]], // comment model order
        row: true,
      })

      const { type = 1 } = ctx.query
      // viewer count ++
      type === 1 && ArticleModel.update({ viewCount: ++data.viewCount }, { where: { id: ctx.params.id } })
      // 濮ｅ繋閲滃ù蹇氼潔鐠佹澘缍嶉柈钘夌摠娑撯偓娑撶尰tamp閿涘矁绻栭弽宄版倵缂侇叀鍏樻径鐔烘箙閸戠儤鏋冪粩鐘垫畱闂冨懓顕扮搾瀣◢閺傞€涚┒閹恒劏宕?      type === 1 && RecordModel.create({ articleId: ctx.params.id })
      // JSON.parse(github)
      data.comments.forEach(comment => {
        comment.user.github = JSON.parse(comment.user.github)
        comment.replies.forEach(reply => {
          reply.user.github = JSON.parse(reply.user.github)
        })
      })
      console.log(data.uuid)
      if (data.type) {
        ctx.body = normalizeArticlePayload(data)
      } else {
        ctx.body = null
      }
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
      let data = await ArticleModel.findOne({
        where: { uuid: ctx.params.uuid },
        include: [
          // 閺屻儲澹?閸掑棛琚?閺嶅洨顒?鐠囧嫯顔?閸ョ偛顦?..
          { model: TagModel, attributes: ['id', 'name'] },
          { model: CategoryModel, attributes: ['id', 'name'] },
          {
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
          },
        ],

        row: true,
      })
      const { type = 1 } = ctx.query
      // viewer count ++
      type === 1 && ArticleModel.update({ viewCount: ++data.viewCount }, { where: { id: data.id } })
      // 濮ｅ繋閲滃ù蹇氼潔鐠佹澘缍嶉柈钘夌摠娑撯偓娑撶尰tamp閿涘矁绻栭弽宄版倵缂侇叀鍏樻径鐔烘箙閸戠儤鏋冪粩鐘垫畱闂冨懓顕扮搾瀣◢閺傞€涚┒閹恒劏宕?      type === 1 && RecordModel.create({ articleId: data.id })
      // JSON.parse(github)
      data.comments.forEach(comment => {
        comment.user.github = JSON.parse(comment.user.github)
        comment.replies.forEach(reply => {
          reply.user.github = JSON.parse(reply.user.github)
        })
      })
      ctx.body = normalizeArticlePayload(data)
    }
  }
  // 閼惧嘲褰囬弬鍥╃彿閸掓銆?  static async getList(ctx) {
    const validator = ctx.validate(ctx.query, {
      page: Joi.string(),
      pageSize: Joi.number(),
      keyword: Joi.string().allow(''), // 閸忔娊鏁€涙鐓＄拠?      category: Joi.string(),
      tag: Joi.string(),
      preview: Joi.number(),
      order: Joi.string(),
      type: Joi.boolean(),
    })

    if (validator) {
      const { page = 1, pageSize = 10, preview = 1, keyword = '', tag, category, order, type = null } = ctx.query
      const tagFilter = buildNormalizedIncludeWhere(tag)
      const categoryFilter = buildNormalizedIncludeWhere(category)

      let articleOrder = [['createdAt', 'DESC']]
      if (order) {
        articleOrder = [order.split(' ')]
      }
      if (type != null) {
        const data = await ArticleModel.findAndCountAll({
          where: {
            id: {
              $not: -1, // 鏉╁洦鎶ら崗鍏呯艾妞ょ敻娼伴惃鍕閺?            },
            $and: {
              type: {
                $eq: JSON.parse(type),
              },
            },
            $or: {
              title: {
                $like: `%${keyword}%`,
              },
              content: {
                $like: `%${keyword}%`,
              },
            },
          },
          include: [
            {
              model: TagModel,
              attributes: ['id', 'name'],
              ...(tagFilter ? { where: tagFilter } : {}),
              required: !!tagFilter
            },
            {
              model: CategoryModel,
              attributes: ['id', 'name'],
              ...(categoryFilter ? { where: categoryFilter } : {}),
              required: !!categoryFilter
            },
            {
              model: CommentModel,
              attributes: ['id'],
              required: false,
              include: [{ model: ReplyModel, attributes: ['id'], required: false }],
            },
          ],
          offset: (page - 1) * pageSize,
          limit: parseInt(pageSize),
          order: articleOrder,
          row: true,
          distinct: true, // count 鐠侊紕鐣?        })
        if (preview === 1) {
          data.rows.forEach(d => {
            d.content = d.content.slice(0, 1000) // 閸欘亝妲搁懢宄板絿妫板嫯顫嶉敍灞藉櫤鐏忔垶澧︽禍鍡欐畱閺佺増宓佹导鐘虹翻閵嗗倶鈧倶鈧?          })
        }
        data.rows = data.rows.map(normalizeArticlePayload).sort((a, b) => b.top - a.top)
        ctx.body = data
      } else {
        const data = await ArticleModel.findAndCountAll({
          where: {
            id: {
              $not: -1, // 鏉╁洦鎶ら崗鍏呯艾妞ょ敻娼伴惃鍕閺?            },
            $or: {
              title: {
                $like: `%${keyword}%`,
              },
              content: {
                $like: `%${keyword}%`,
              },
            },
          },
          include: [
            {
              model: TagModel,
              attributes: ['id', 'name'],
              ...(tagFilter ? { where: tagFilter } : {}),
              required: !!tagFilter
            },
            {
              model: CategoryModel,
              attributes: ['id', 'name'],
              ...(categoryFilter ? { where: categoryFilter } : {}),
              required: !!categoryFilter
            },
            {
              model: CommentModel,
              attributes: ['id'],
              required: false,
              include: [{ model: ReplyModel, attributes: ['id'], required: false }],
            },
          ],
          offset: (page - 1) * pageSize,
          limit: parseInt(pageSize),
          order: articleOrder,
          row: true,
          distinct: true, // count 鐠侊紕鐣?        })
        if (preview === 1) {
          data.rows.forEach(d => {
            d.content = d.content.slice(0, 1000) // 閸欘亝妲搁懢宄板絿妫板嫯顫嶉敍灞藉櫤鐏忔垶澧︽禍鍡欐畱閺佺増宓佹导鐘虹翻閵嗗倶鈧倶鈧?          })
        }
        data.rows = data.rows.map(normalizeArticlePayload).sort((a, b) => b.top - a.top)
        ctx.body = data
      }
    }
  }

  // 娣囶喗鏁奸弬鍥╃彿
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
      const { title, content, cover, cardCover, description, categories = [], tags = [], type, top, musicId, musicName } = ctx.request.body
      const articleId = parseInt(ctx.params.id)
      const tagList = normalizeNameList(tags).map(tag => ({ name: tag, articleId }))
      const categoryList = normalizeNameList(categories).map(cate => ({ name: cate, articleId }))
      await ArticleModel.update({ title, content, cover, cardCover, description, type, top, musicId, musicName }, { where: { id: articleId } })
      await TagModel.destroy({ where: { articleId } })
      await TagModel.bulkCreate(tagList)
      await CategoryModel.destroy({ where: { articleId } })
      await CategoryModel.bulkCreate(categoryList)
      ctx.body = { type: type }
    }
  }

  // 閸掔娀娅庨弬鍥╃彿
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

  // 閸掔娀娅庢径姘嚋閺傚洨鐝?  static async delList(ctx) {
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

  /**
   * 绾喛顓婚弬鍥╃彿閺勵垰鎯佺€涙ê婀?   *
   * @response existList: 閺佺増宓佹惔鎾茶厬瀹告彃鐡ㄩ崷銊︽箒閻ㄥ嫭鏋冪粩鐙呯礄閸栧懎鎯堥弬鍥╃彿閻ㄥ嫬鍙挎担鎾冲敶鐎圭櫢绱?   * @response noExistList: 鐟欙絾鐎?md 閺傚洣娆?楠炴湹绗栨潻鏂挎礀閺佺増宓佹惔鎾茶厬娑撳秴鐡ㄩ崷銊ф畱 閸忚渹缍嬮張澶嬫瀮娴犺泛鎮?鐟欙絾鐎介崥搴ｆ畱閺傚洣娆㈤弽鍥暯
   */
  static async checkExist(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      fileNameList: Joi.array().required(),
    })
    console.log(ctx.request.body)

    if (validator) {
      const { fileNameList } = ctx.request.body
      console.log(fileNameList)
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
            console.log(error)
          }
        })
      )

      ctx.body = list
    }
  }

  // 娑撳﹣绱堕弬鍥╃彿
  static async upload(ctx) {
    const file = ctx.request.files.file // 閼惧嘲褰囨稉濠佺炊閺傚洣娆?
    await findOrCreateFilePath(uploadPath) // 閸掓稑缂撻弬鍥︽閻╊喖缍?    const upload = file => {
      const reader = fs.createReadStream(file.path) // 閸掓稑缂撻崣顖濐嚢濞?      const fileName = file.name
      const filePath = `${uploadPath}/${fileName}`
      const upStream = fs.createWriteStream(filePath)
      reader.pipe(upStream)

      reader.on('end', function () {
        console.log('娑撳﹣绱堕幋鎰')
      })
    }
    Array.isArray(file) ? file.forEach(it => upload(it)) : upload(file)
    ctx.status = 204
  }

  // 绾喛顓婚幓鎺戝弳閺傚洨鐝?  static async uploadConfirm(ctx) {
    const validator = ctx.validate(ctx.request.body, {
      authorId: Joi.number(),
      uploadList: Joi.array(),
    })
    if (validator) {
      const { uploadList, authorId } = ctx.request.body
      await findOrCreateFilePath(uploadPath) // 濡偓閺屻儳娲拌ぐ?      // const insertList = []
      // const updateList = []
      // uploadList.forEach(file => {
      //   file.exist ? updateList.push(file) : insertList.push(file)
      // })

      const _parseList = list => {
        return list.map(item => {
          const filePath = `${uploadPath}/${item.fileName}`
          const result = decodeFile(filePath)
          const { title, date, categories = [], tags = [], content } = result
          const data = {
            title: title || item.fileName.replace(/\.md/, ''),
            categories: categories.map(d => ({ name: d })),
            tags: tags.map(d => ({ name: d })),
            content,
            authorId,
          }
          if (date) data.createdAt = date
          if (item.articleId) data.articleId = item.articleId
          return data
        })
      }

      const list = _parseList(uploadList)
      const updateList = list.filter(d => !!d.articleId)
      const insertList = list.filter(d => !d.articleId)

      // 閹绘帒鍙嗛弬鍥╃彿
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

      ctx.body = { message: '鐎电厧鍙嗛弬鍥╃彿閹存劕濮?, insertList: insertResultList, updateList: updateResultList }
    }
  }

  // 鐎电厧鍤弬鍥╃彿
  static async output(ctx) {
    const validator = ctx.validate(ctx.params, {
      id: Joi.number().required(),
    })

    if (validator) {
      const article = await ArticleModel.findOne({
        where: { id: ctx.params.id },
        include: [
          // 閺屻儲澹?閸掑棛琚?          { model: TagModel, attributes: ['id', 'name'] },
          { model: CategoryModel, attributes: ['id', 'name'] },
        ],
      })

      const { filePath, fileName } = await generateFile(article)
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
          // 閺屻儲澹?閸掑棛琚?          { model: TagModel, attributes: ['id', 'name'] },
          { model: CategoryModel, attributes: ['id', 'name'] },
        ],
      })

      // const filePath = await generateFile(list[0])
      await Promise.all(list.map(article => generateFile(article)))

      // 閹垫挸瀵橀崢瀣級 ...
      const zipName = 'mdFiles.zip'
      const zipStream = fs.createWriteStream(`${outputPath}/${zipName}`)
      const zip = archiver('zip')
      zip.pipe(zipStream)
      list.forEach(item => {
        zip.append(fs.createReadStream(`${outputPath}/${item.title}.md`), {
          name: `${item.title}.md`, // 閸樺缂夐弬鍥︽閸?        })
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
          $not: -1, // 鏉╁洦鎶ら崗鍏呯艾妞ょ敻娼伴惃鍕閺?        },
      },
      include: [
        // 閺屻儲澹?閸掑棛琚?        { model: TagModel, attributes: ['id', 'name'] },
        { model: CategoryModel, attributes: ['id', 'name'] },
      ],
    })

    // const filePath = await generateFile(list[0])
    await Promise.all(list.map(article => generateFile(article)))

    // 閹垫挸瀵橀崢瀣級 ...
    const zipName = 'mdFiles.zip'
    const zipStream = fs.createWriteStream(`${outputPath}/${zipName}`)
    const zip = archiver('zip')
    zip.pipe(zipStream)
    list.forEach(item => {
      zip.append(fs.createReadStream(`${outputPath}/${item.title}.md`), {
        name: `${item.title}.md`, // 閸樺缂夐弬鍥︽閸?      })
    })
    await zip.finalize()

    ctx.attachment(decodeURI(zipName))
    await send(ctx, zipName, { root: outputPath })
  }

  // 閼惧嘲褰囪ぐ鎺撱€傞弫鐗堝祦
  static async getArchives(ctx) {
    try {
      // 閺屻儴顕楅幍鈧張澶婂嚒閸欐垵绔烽惃鍕瀮缁旂媴绱濋幐澶婂灡瀵ょ儤妞傞梻鏉戔偓鎺戠碍閹烘帒鍨?      const articles = await ArticleModel.findAll({
        where: {
          id: {
            $not: -1, // 鏉╁洦鎶ら崗鍏呯艾妞ょ敻娼伴惃鍕閺?          },
          type: true, // 閸欘亝鐓＄拠銏犲嚒閸欐垵绔烽惃鍕瀮缁?        },
        attributes: ['id', 'title', 'description', 'cover', 'cardCover', 'viewCount', 'likeCount', 'createdAt', 'updatedAt'],
        include: [
          { model: TagModel, attributes: ['id', 'name'] },
          { model: CategoryModel, attributes: ['id', 'name'] },
          { model: CommentModel, attributes: ['id'] },
        ],
        order: [['createdAt', 'DESC']],
      })

      // 閹稿鍕鹃張鍫濆瀻缂?      const archiveMap = new Map()

      articles.forEach(article => {
        const date = new Date(article.createdAt)
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        // 閸掓繂顫愰崠鏍у嬀娴犺姤鏆熼幑?        if (!archiveMap.has(year)) {
          archiveMap.set(year, {
            year,
            count: 0,
            months: new Map(),
          })
        }

        const yearData = archiveMap.get(year)
        yearData.count++

        // 閸掓繂顫愰崠鏍ㄦ箑娴犺姤鏆熼幑?        if (!yearData.months.has(month)) {
          yearData.months.set(month, {
            month,
            count: 0,
            articles: [],
          })
        }

        const monthData = yearData.months.get(month)
        monthData.count++

        // 鏉烆剚宕查弬鍥╃彿閺佺増宓侀弽鐓庣础
        const articleData = {
          id: article.id,
          title: article.title,
          description: article.description,
          cover: article.cover,
          cardCover: article.cardCover,
          viewCount: article.viewCount,
          likeCount: article.likeCount,
          commentCount: article.comments?.length || 0,
          category: article.categories?.[0] || null,
          tags: article.tags || [],
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        }

        monthData.articles.push(articleData)
      })

      // 鏉烆剚宕叉稉鐑樻殶缂佸嫭鐗稿?      const years = Array.from(archiveMap.values()).map(yearData => ({
        year: yearData.year,
        count: yearData.count,
        months: Array.from(yearData.months.values()).map(monthData => ({
          month: monthData.month,
          count: monthData.count,
          articles: monthData.articles,
        })),
      }))

      ctx.body = years
    } catch (error) {
      console.error('閼惧嘲褰囪ぐ鎺撱€傞弫鐗堝祦婢惰精瑙?', error)
      ctx.throw(500, '閼惧嘲褰囪ぐ鎺撱€傞弫鐗堝祦婢惰精瑙?)
    }
  }

}

module.exports = ArticleController
