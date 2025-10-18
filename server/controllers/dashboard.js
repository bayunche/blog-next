const { article: ArticleModel, user: UserModel, comment: CommentModel, sequelize } = require('../models')
const { Op } = require('sequelize')

class DashboardController {
  static async getOverview(ctx) {
    try {
      const [articleCount, userCount, commentCount, totalViews, recentArticles] = await Promise.all([
        ArticleModel.count(),
        UserModel.count(),
        CommentModel.count(),
        ArticleModel.sum('viewCount'),
        ArticleModel.findAll({
          attributes: ['id', 'title', 'createdAt', 'viewCount', 'likeCount', 'type'],
          order: [['createdAt', 'DESC']],
          limit: 5,
        }),
      ])

      ctx.body = {
        stats: {
          articleCount: Number(articleCount) || 0,
          userCount: Number(userCount) || 0,
          commentCount: Number(commentCount) || 0,
          viewCount: Number(totalViews) || 0,
        },
        recentArticles: recentArticles.map((article) => ({
          id: article.id,
          title: article.title,
          createdAt: article.createdAt,
          viewCount: Number(article.viewCount) || 0,
          likeCount: Number(article.likeCount) || 0,
          status: article.type ? 'published' : 'draft',
        })),
      }
    } catch (error) {
      console.error('Failed to fetch dashboard overview:', error)
      ctx.throw(500, '获取仪表盘数据失败')
    }
  }

  static async getArticleTrend(ctx) {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const dialect = sequelize.getDialect()
      const dateFunction = dialect === 'mysql' ? 'DATE' : 'date'

      const trend = await ArticleModel.findAll({
        attributes: [
          [sequelize.fn(dateFunction, sequelize.col('createdAt')), 'date'],
          [sequelize.fn('SUM', sequelize.col('viewCount')), 'count'],
        ],
        where: {
          createdAt: {
            [Op.gte]: thirtyDaysAgo,
          },
        },
        group: [sequelize.fn(dateFunction, sequelize.col('createdAt'))],
        order: [[sequelize.fn(dateFunction, sequelize.col('createdAt')), 'ASC']],
        raw: true,
      })

      ctx.body = trend.map((item) => ({
        date: item.date,
        count: Number(item.count) || 0,
      }))
    } catch (error) {
      console.error('Failed to fetch article trend:', error)
      ctx.throw(500, '获取文章阅读趋势失败')
    }
  }
}

module.exports = DashboardController
