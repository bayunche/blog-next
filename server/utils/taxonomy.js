const {
  article: ArticleModel,
  tag: TagModel,
  category: CategoryModel,
  comment: CommentModel,
  reply: ReplyModel,
  sequelize,
} = require('../models')

const PUBLIC_UNCATEGORIZED_NAME = '\u672a\u5206\u7c7b'
const DEFAULT_PAGE_SIZE = 50
const MAX_PAGE_SIZE = 100
const PREVIEW_LENGTH = 1000

const normalizeName = value => String(value || '').trim().replace(/\s+/g, ' ')
const normalizeKey = value => normalizeName(value).toLowerCase()

const isUncategorizedName = value => {
  const key = normalizeKey(value)
  return !key || key === 'uncategorized' || key === normalizeKey(PUBLIC_UNCATEGORIZED_NAME)
}

const clampPositiveInt = (value, fallback, max) => {
  const parsed = parseInt(value, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(parsed, max)
}

const buildNormalizedWhere = value => {
  const normalized = normalizeKey(value)

  return sequelize.where(
    sequelize.fn('LOWER', sequelize.fn('TRIM', sequelize.col('name'))),
    normalized
  )
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

      const key = normalizeKey(name)
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

const getPublishedArticleWhere = () => ({
  id: { $not: -1 },
  type: { $eq: true },
})

const sortByCountThenName = (left, right) => {
  if (right.count !== left.count) return right.count - left.count
  return left.name.localeCompare(right.name, 'zh-Hans-CN')
}

const sortArticles = (left, right) => {
  if (Number(right.top || 0) !== Number(left.top || 0)) {
    return Number(right.top || 0) - Number(left.top || 0)
  }

  return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
}

const buildKeywordMatcher = keyword => {
  const normalized = normalizeKey(keyword)
  if (!normalized) return null

  return article => {
    const title = String(article && article.title ? article.title : '').toLowerCase()
    const content = String(article && article.content ? article.content : '').toLowerCase()
    return title.includes(normalized) || content.includes(normalized)
  }
}

const slicePreview = rows => rows.map(article => {
  if (!article || typeof article.content !== 'string') return article
  return { ...article, content: article.content.slice(0, PREVIEW_LENGTH) }
})

const aggregateRelationRows = rows => {
  const merged = new Map()

  ;(rows || []).forEach(item => {
    const raw = typeof item.toJSON === 'function' ? item.toJSON() : item
    const name = normalizeName(raw.name)
    const articleId = raw.articleId
    if (!name || articleId == null) return

    const key = normalizeKey(name)
    let current = merged.get(key)
    if (!current) {
      current = { name, count: 0, articleIds: new Set() }
      merged.set(key, current)
    }

    if (current.articleIds.has(articleId)) return
    current.articleIds.add(articleId)
    current.count += 1
  })

  return Array.from(merged.values())
    .map(({ articleIds, ...item }) => item)
    .sort(sortByCountThenName)
}

const aggregateNamesFromArticles = (articles, picker, options = {}) => {
  const excluded = new Set((options.excludeNames || []).map(normalizeKey).filter(Boolean))
  const merged = new Map()

  ;(articles || []).forEach(article => {
    const seenInArticle = new Set()
    const items = picker(article) || []

    items.forEach(item => {
      const name = normalizeName(item && item.name)
      const key = normalizeKey(name)
      if (!name || excluded.has(key) || seenInArticle.has(key)) return

      seenInArticle.add(key)

      const current = merged.get(key)
      if (current) {
        current.count += 1
        return
      }

      merged.set(key, { name, count: 1 })
    })
  })

  const result = Array.from(merged.values()).sort(sortByCountThenName)
  if (typeof options.limit === 'number') {
    return result.slice(0, options.limit)
  }

  return result
}

async function loadPublishedTagRows() {
  return TagModel.findAll({
    attributes: ['name', 'articleId'],
    where: {
      articleId: { $not: null },
    },
    include: [{
      model: ArticleModel,
      as: 'article',
      attributes: ['id'],
      required: true,
      where: getPublishedArticleWhere(),
    }],
    order: [['name', 'ASC']],
  })
}

async function loadPublishedCategoryRows() {
  return CategoryModel.findAll({
    attributes: ['name', 'articleId'],
    where: {
      articleId: { $not: null },
    },
    include: [{
      model: ArticleModel,
      as: 'article',
      attributes: ['id'],
      required: true,
      where: getPublishedArticleWhere(),
    }],
    order: [['name', 'ASC']],
  })
}

async function loadPublishedArticlesByIds(articleIds) {
  const ids = Array.from(new Set((articleIds || []).filter(Boolean)))
  if (ids.length === 0) return []

  const articles = await ArticleModel.findAll({
    where: {
      id: { $in: ids },
      type: { $eq: true },
    },
    include: [
      { model: TagModel, attributes: ['id', 'name'], required: false },
      { model: CategoryModel, attributes: ['id', 'name'], required: false },
      {
        model: CommentModel,
        attributes: ['id'],
        required: false,
        include: [{ model: ReplyModel, attributes: ['id'], required: false }],
      },
    ],
    order: [['createdAt', 'DESC']],
  })

  return articles.map(normalizeArticlePayload).sort(sortArticles)
}

async function loadAllPublishedArticlesWithCategories() {
  const articles = await ArticleModel.findAll({
    where: getPublishedArticleWhere(),
    include: [
      { model: TagModel, attributes: ['id', 'name'], required: false },
      { model: CategoryModel, attributes: ['id', 'name'], required: false },
      {
        model: CommentModel,
        attributes: ['id'],
        required: false,
        include: [{ model: ReplyModel, attributes: ['id'], required: false }],
      },
    ],
    order: [['createdAt', 'DESC']],
  })

  return articles.map(normalizeArticlePayload).sort(sortArticles)
}

async function countPublishedUncategorizedArticles() {
  const articles = await ArticleModel.findAll({
    where: getPublishedArticleWhere(),
    attributes: ['id'],
    include: [
      { model: CategoryModel, attributes: ['id', 'name'], required: false },
    ],
    order: [['id', 'ASC']],
  })

  return articles
    .map(normalizeArticlePayload)
    .filter(article => !Array.isArray(article.categories) || article.categories.length === 0)
    .length
}

function finalizeArticleList(articles, options = {}) {
  const page = clampPositiveInt(options.page, 1, Number.MAX_SAFE_INTEGER)
  const pageSize = clampPositiveInt(options.pageSize, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE)
  const preview = String(options.preview ?? '1') === '1'
  const keywordMatcher = buildKeywordMatcher(options.keyword)
  const filtered = keywordMatcher ? articles.filter(keywordMatcher) : articles
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  return {
    rows: preview ? slicePreview(paged) : paged,
    count: filtered.length,
    page,
    pageSize,
  }
}

async function getPublicTagSummaries() {
  const rows = await loadPublishedTagRows()
  return aggregateRelationRows(rows)
}

async function getPublicCategorySummaries() {
  const [rows, uncategorizedCount] = await Promise.all([
    loadPublishedCategoryRows(),
    countPublishedUncategorizedArticles(),
  ])

  const summaries = aggregateRelationRows(rows)
  if (uncategorizedCount > 0) {
    summaries.push({
      name: PUBLIC_UNCATEGORIZED_NAME,
      count: uncategorizedCount,
    })
  }

  return summaries.sort(sortByCountThenName)
}

async function getPublicTagDetail(name, options = {}) {
  const normalizedInput = normalizeName(name)
  const matchingRows = (await loadPublishedTagRows()).filter(item => normalizeKey(item.name) === normalizeKey(normalizedInput))
  const canonicalName = aggregateRelationRows(matchingRows)[0]?.name || normalizedInput
  const articles = await loadPublishedArticlesByIds(matchingRows.map(item => item.articleId))
  const result = finalizeArticleList(articles, options)

  return {
    tag: {
      name: canonicalName,
      displayName: canonicalName,
    },
    rows: result.rows,
    count: result.count,
    relatedTags: aggregateNamesFromArticles(articles, article => article.tags, {
      excludeNames: [canonicalName],
      limit: 6,
    }),
    relatedCategories: aggregateNamesFromArticles(articles, article => article.categories, {
      excludeNames: [PUBLIC_UNCATEGORIZED_NAME],
      limit: 6,
    }),
  }
}

async function getPublicCategoryDetail(name, options = {}) {
  const normalizedInput = normalizeName(name)
  const uncategorized = isUncategorizedName(normalizedInput)

  let canonicalName = uncategorized ? PUBLIC_UNCATEGORIZED_NAME : normalizedInput
  let articles = []

  if (uncategorized) {
    articles = (await loadAllPublishedArticlesWithCategories()).filter(article => !Array.isArray(article.categories) || article.categories.length === 0)
  } else {
    const matchingRows = (await loadPublishedCategoryRows()).filter(item => normalizeKey(item.name) === normalizeKey(normalizedInput))
    canonicalName = aggregateRelationRows(matchingRows)[0]?.name || canonicalName
    articles = await loadPublishedArticlesByIds(matchingRows.map(item => item.articleId))
  }

  const result = finalizeArticleList(articles, options)

  return {
    category: {
      name: canonicalName,
      displayName: canonicalName,
      isUncategorized: uncategorized,
    },
    rows: result.rows,
    count: result.count,
    relatedTags: aggregateNamesFromArticles(articles, article => article.tags, {
      limit: 8,
    }),
  }
}

module.exports = {
  PUBLIC_UNCATEGORIZED_NAME,
  buildNormalizedWhere,
  getPublicCategoryDetail,
  getPublicCategorySummaries,
  getPublicTagDetail,
  getPublicTagSummaries,
  isUncategorizedName,
  normalizeName,
}
