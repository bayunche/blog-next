import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'

const models = require('../../models')
const ArticleModel = models.article
const UserModel = models.user
const CommentModel = models.comment

const originalArticleCount = ArticleModel.count
const originalArticleSum = ArticleModel.sum
const originalArticleFindAll = ArticleModel.findAll
const originalUserCount = UserModel.count
const originalCommentCount = CommentModel.count

ArticleModel.count = vi.fn()
ArticleModel.sum = vi.fn()
ArticleModel.findAll = vi.fn()
UserModel.count = vi.fn()
CommentModel.count = vi.fn()

const DashboardController = require('../dashboard')

afterAll(() => {
  ArticleModel.count = originalArticleCount
  ArticleModel.sum = originalArticleSum
  ArticleModel.findAll = originalArticleFindAll
  UserModel.count = originalUserCount
  CommentModel.count = originalCommentCount
})

describe('DashboardController.getOverview', () => {
  beforeEach(() => {
    ;(ArticleModel.count as unknown as vi.Mock).mockReset()
    ;(ArticleModel.sum as unknown as vi.Mock).mockReset()
    ;(ArticleModel.findAll as unknown as vi.Mock).mockReset()
    ;(UserModel.count as unknown as vi.Mock).mockReset()
    ;(CommentModel.count as unknown as vi.Mock).mockReset()
  })

  it('returns aggregated stats and recent articles', async () => {
    ;(ArticleModel.count as unknown as vi.Mock).mockResolvedValue(42)
    ;(UserModel.count as unknown as vi.Mock).mockResolvedValue(10)
    ;(CommentModel.count as unknown as vi.Mock).mockResolvedValue(120)
    ;(ArticleModel.sum as unknown as vi.Mock).mockResolvedValue(5600)
    ;(ArticleModel.findAll as unknown as vi.Mock).mockResolvedValue([
      {
        id: 1,
        title: 'Article 1',
        createdAt: '2025-10-01 10:00:00',
        viewCount: 320,
        likeCount: 12,
        type: true,
      },
    ])

    const ctx: any = { body: null }

    await DashboardController.getOverview(ctx)

    expect(ctx.body.stats).toEqual({
      articleCount: 42,
      userCount: 10,
      commentCount: 120,
      viewCount: 5600,
    })
    expect(ctx.body.recentArticles.length).toBe(1)
    expect(ctx.body.recentArticles[0].status).toBe('published')
  })

  it('handles errors by throwing 500', async () => {
    const error = new Error('db failure')
    ;(ArticleModel.count as unknown as vi.Mock).mockRejectedValue(error)

    const ctx: any = {
      throw: vi.fn(),
    }

    await DashboardController.getOverview(ctx)

    expect(ctx.throw).toHaveBeenCalledWith(500, '获取仪表盘数据失败')
  })
})
