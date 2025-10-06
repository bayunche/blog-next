/**
 * 归档数据构建工具
 * 将文章列表按年份、月份聚合为前端所需时间线结构
 */

function toPlain(entity) {
  if (!entity) {
    return null
  }
  return typeof entity.toJSON === 'function' ? entity.toJSON() : entity
}

function normalizeArticle(rawArticle) {
  const article = toPlain(rawArticle) || rawArticle
  const categories = Array.isArray(article.categories) ? article.categories : []
  const tags = Array.isArray(article.tags) ? article.tags : []

  const primaryCategory = categories[0] ? toPlain(categories[0]) : null

  return {
    id: article.id,
    title: article.title,
    description: article.description || '',
    cover: article.cover || null,
    viewCount: article.viewCount ?? 0,
    likeCount: article.likeCount ?? 0,
    commentCount: Array.isArray(article.comments) ? article.comments.length : 0,
    category: primaryCategory,
    tags: tags.map((tag) => toPlain(tag)).filter(Boolean),
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  }
}

/**
 * 将文章按年份、月份分组
 * @param {Array<any>} articles Sequelize 查询返回的文章列表
 * @returns {{ years: Array, total: number }}
 */
function buildArchiveTimeline(articles = []) {
  const archiveMap = new Map()

  articles.forEach((item) => {
    const article = normalizeArticle(item)

    if (!article.createdAt) {
      return
    }

    const createdAt = new Date(article.createdAt)
    if (Number.isNaN(createdAt.getTime())) {
      return
    }

    const year = createdAt.getFullYear()
    const month = createdAt.getMonth() + 1

    if (!archiveMap.has(year)) {
      archiveMap.set(year, {
        year,
        count: 0,
        months: new Map(),
      })
    }

    const yearBucket = archiveMap.get(year)
    yearBucket.count += 1

    if (!yearBucket.months.has(month)) {
      yearBucket.months.set(month, {
        month,
        articles: [],
      })
    }

    const monthBucket = yearBucket.months.get(month)
    monthBucket.articles.push(article)
  })

  const years = Array.from(archiveMap.values())
    .sort((a, b) => b.year - a.year)
    .map((yearBucket) => {
      const months = Array.from(yearBucket.months.values())
        .sort((a, b) => b.month - a.month)
        .map((monthBucket) => ({
          month: monthBucket.month,
          count: monthBucket.articles.length,
          articles: monthBucket.articles.sort((a, b) => {
            const left = new Date(b.createdAt || 0).getTime()
            const right = new Date(a.createdAt || 0).getTime()
            return left - right
          }),
        }))

      return {
        year: yearBucket.year,
        count: yearBucket.count,
        months,
      }
    })

  return {
    years,
    total: articles.length,
  }
}

module.exports = {
  buildArchiveTimeline,
}
