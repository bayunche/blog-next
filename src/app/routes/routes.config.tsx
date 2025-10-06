/**
 * Route configuration for the application.
 */

import { Navigate, type RouteObject } from "react-router-dom"
import { ProtectedRoute } from "./ProtectedRoute"
import { GithubCallbackPage, GithubLoginingPage } from "@features/auth"
import {
  ArchivesPage,
  ArticleDetailPage,
  ArticleListPage,
  CategoriesPage,
  CategoryDetailPage,
  ShareArticlePage,
  TagDetailPage,
  TagsPage,
} from "@features/article"
import { AboutPage } from "@features/about"
import { FragmentPage } from "@features/fragment"
import {
  AdminLayout,
  ArticleEditor,
  ArticleManager,
  ArticleAnalytics,
  Dashboard,
  FragmentAnalytics,
  FragmentEditor,
  FragmentManager,
  Monitor,
  UserManager,
} from "@features/admin"
import { WelcomePage, NotFoundPage } from "@features/misc"
import { WebLayout } from "@features/layout"

const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>{title}</h1>
    <p>Page under construction...</p>
  </div>
)

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },
  {
    path: "/",
    element: <WebLayout />,
    children: [
      {
        path: "home",
        element: <ArticleListPage />,
      },
      {
        path: "article/:id",
        element: <ArticleDetailPage />,
      },
      {
        path: "article/share/:uuid",
        element: <ShareArticlePage />,
      },
      {
        path: "archives",
        element: <ArchivesPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "categories/:name",
        element: <CategoryDetailPage />,
      },
      {
        path: "tags",
        element: <TagsPage />,
      },
      {
        path: "tags/:name",
        element: <TagDetailPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "fragment",
        element: <FragmentPage />,
      },
      {
        path: "fragments",
        element: <Navigate to="/fragment" replace />,
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "article/manager",
            element: <ArticleManager />,
          },
          {
            path: "article/add",
            element: <ArticleEditor />,
          },
          {
            path: "article/edit/:id",
            element: <ArticleEditor />,
          },
          {
            path: "article/graph",
            element: <ArticleAnalytics />,
          },
          {
            path: "fragment/manager",
            element: <FragmentManager />,
          },
          {
            path: "fragment/add",
            element: <FragmentEditor />,
          },
          {
            path: "fragment/edit/:id",
            element: <FragmentEditor />,
          },
          {
            path: "fragment/graph",
            element: <FragmentAnalytics />,
          },
          {
            path: "user",
            element: <UserManager />,
          },
          {
            path: "monitor",
            element: <Monitor />,
          },
        ],
      },
    ],
  },
  {
    path: "/welcome",
    element: <WelcomePage />,
  },
  {
    path: "/github",
    element: <GithubCallbackPage />,
  },
  {
    path: "/login",
    element: <GithubLoginingPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]



