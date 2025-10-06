import { describe, it, expect, vi } from "vitest"

vi.mock("oh-my-live2d", () => ({
  loadOml2d: vi.fn(),
}))

vi.mock("@features/layout", () => ({
  WebLayout: () => null,
}))

vi.mock("@features/admin", () => ({
  AdminLayout: () => null,
  ArticleEditor: () => null,
  ArticleManager: () => null,
  ArticleAnalytics: () => null,
  Dashboard: () => null,
  FragmentAnalytics: () => null,
  FragmentEditor: () => null,
  FragmentManager: () => null,
  Monitor: () => null,
  UserManager: () => null,
}))

import { routes } from "./routes.config"
import { GithubLoginingPage } from "@features/auth"
import { CategoryDetailPage, TagDetailPage } from "@features/article"
import { AboutPage } from "@features/about"
import { ArticleAnalytics as ArticleAnalyticsFromAdmin } from "@features/admin"

describe("routes.config", () => {
  const root = routes.find((route) => route.children && route.children.length)
  const webChildren = root?.children || []

  it("maps category detail route to CategoryDetailPage", () => {
    const route = webChildren.find((child) => child.path === "categories/:name")
    expect(route?.element?.type).toBe(CategoryDetailPage)
  })

  it("maps tag detail route to TagDetailPage", () => {
    const route = webChildren.find((child) => child.path === "tags/:name")
    expect(route?.element?.type).toBe(TagDetailPage)
  })

  it("maps about route to AboutPage", () => {
    const route = webChildren.find((child) => child.path === "about")
    expect(route?.element?.type).toBe(AboutPage)
  })

  it("maps /login to GithubLoginingPage", () => {
    const loginRoute = routes.find((route) => route.path === "/login")
    expect(loginRoute?.element?.type).toBe(GithubLoginingPage)
  })

  it("maps article analytics route to ArticleAnalytics component", () => {
    const adminRoute = routes.find((route) => route.path === "/admin")
    const articleGraphRoute = adminRoute?.children?.[0]?.children?.find((child) => child.path === "article/graph")
    expect(articleGraphRoute?.element?.type).toBe(ArticleAnalyticsFromAdmin)
  })
})
