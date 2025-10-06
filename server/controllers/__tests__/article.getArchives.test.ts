import { describe, it, expect, vi, beforeEach, afterAll } from "vitest"

const models = require("../../models")
const ArticleModel = models.article
const originalFindAll = ArticleModel.findAll
ArticleModel.findAll = vi.fn()
const findAllMock = ArticleModel.findAll as unknown as vi.Mock

const ArticleController = require("../article")

afterAll(() => {
  ArticleModel.findAll = originalFindAll
})

describe("ArticleController.getArchives", () => {
  beforeEach(() => {
    findAllMock.mockReset()
  })

  it("returns archive data successfully", async () => {
    const mockArticles = [
      {
        id: 1,
        title: "Article A",
        description: "",
        cover: null,
        viewCount: 10,
        likeCount: 2,
        createdAt: "2024-05-01 10:00:00",
        updatedAt: "2024-05-01 10:00:00",
        categories: [{ id: 1, name: "CategoryA" }],
        tags: [{ id: 1, name: "TagA" }],
        comments: [],
      },
      {
        id: 2,
        title: "Article B",
        description: "",
        cover: null,
        viewCount: 5,
        likeCount: 1,
        createdAt: "2024-05-10 12:00:00",
        updatedAt: "2024-05-10 12:00:00",
        categories: [{ id: 2, name: "CategoryB" }],
        tags: [],
        comments: [{ id: 1 }],
      },
    ]

    findAllMock.mockResolvedValue(mockArticles)

    const ctx: any = { body: null }

    await ArticleController.getArchives(ctx)

    expect(ctx.body.total).toBe(2)
    expect(ctx.body.years[0].year).toBe(2024)
    expect(ctx.body.years[0].months[0].month).toBe(5)
    expect(ctx.body.years[0].months[0].articles[0].id).toBe(2)
  })

  it("handles database error", async () => {
    const error = new Error("db error test")
    findAllMock.mockRejectedValue(error)

    const ctx: any = {
      body: null,
      throw: vi.fn(),
    }

    await ArticleController.getArchives(ctx)

    expect(ctx.throw).toHaveBeenCalledWith(500, "\u83B7\u53D6\u5F52\u6863\u6570\u636E\u5931\u8D25")
  })
})
