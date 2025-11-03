import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useArticleList } from '../hooks'
import styles from './ArticleListPage.module.less'

const PAGE_SIZE = 12

export function ArticleListPage() {
  const { t } = useTranslation('article')
  const [page, setPage] = useState(1)
  const { data, isLoading, error, isFetching } = useArticleList({
    params: {
      page,
      pageSize: PAGE_SIZE,
      orderBy: 'createdAt',
      order: 'DESC',
    },
    keepPreviousData: true,
  })

  const articles = data?.list ?? []
  const totalPages = data?.totalPages ?? 1
  const emptyState = useMemo(
    () => ({
      title: t('list.emptyTitle', { defaultValue: '暂无文章' }),
      description: t('list.emptyDescription', {
        defaultValue: '这里还没有痕迹。稍等片刻，新的想法会落笔。',
      }),
    }),
    [t]
  )

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroCaption}>{t('list.caption', { defaultValue: 'Latest Notes' })}</span>
          <h1>{t('list.title', { defaultValue: '最新文章' })}</h1>
          <p>{t('list.subtitle', { defaultValue: '记录灵感落地的过程，也记录它们的弯路。' })}</p>
        </div>
        <div className={styles.heroStats}>
          <div>
            <strong>{data?.total ?? 0}</strong>
            <span>{t('list.total', { defaultValue: '篇文章' })}</span>
          </div>
          <div>
            <strong>{PAGE_SIZE}</strong>
            <span>{t('list.pageSize', { defaultValue: '每页展示' })}</span>
          </div>
          <div>
            <strong>{totalPages}</strong>
            <span>{t('list.totalPages', { defaultValue: '总页数' })}</span>
          </div>
        </div>
      </header>

      {error && (
        <div className={styles.message} role="alert">
          {t('error.title', { defaultValue: '加载失败，请稍后重试。' })}
        </div>
      )}

      {(isLoading && !data) ? (
        <div className={styles.message}>{t('loading', { defaultValue: '加载中…' })}</div>
      ) : articles.length === 0 ? (
        <div className={styles.empty}>
          <h2>{emptyState.title}</h2>
          <p>{emptyState.description}</p>
        </div>
      ) : (
        <section className={styles.list} aria-live={isFetching ? 'polite' : 'off'}>
          {articles.map((article) => {
            const href = article.slug ? `/posts/${article.slug}` : `/article/${article.id}`
            const description = article.description?.trim() || ''
            const preview = description.length > 160 ? `${description.slice(0, 160)}…` : description

            return (
              <article key={article.id} className={styles.item}>
                <header>
                  <div className={styles.itemMeta}>
                    <time dateTime={article.createdAt}>{dayjs(article.createdAt).format('YYYY-MM-DD')}</time>
                    <span>{article.category?.name ?? t('meta.uncategorized', { defaultValue: '未分类' })}</span>
                  </div>
                  <Link to={href} className={styles.itemTitle}>
                    {article.title}
                  </Link>
                </header>
                {preview && <p className={styles.itemDescription}>{preview}</p>}
                <footer className={styles.itemFooter}>
                  <ul>
                    {article.tags.slice(0, 3).map((tag) => (
                      <li key={tag.id}>#{tag.name}</li>
                    ))}
                  </ul>
                  <span className={styles.itemStats}>
                    {article.viewCount} views · {article.commentCount} comments
                  </span>
                </footer>
              </article>
            )
          })}
        </section>
      )}

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label={t('list.pagination', { defaultValue: '分页导航' })}>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page <= 1 || isFetching}
          >
            {t('list.prev', { defaultValue: '上一页' })}
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page >= totalPages || isFetching}
          >
            {t('list.next', { defaultValue: '下一页' })}
          </button>
        </nav>
      )}
    </main>
  )
}

export default ArticleListPage
