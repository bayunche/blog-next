import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useArchives } from '../hooks'
import { OWNERSHIP_INFO } from '@shared/constants/blog.config'
import styles from './ArchivesPage.module.less'

export function ArchivesPage() {
  const { data, isLoading, error } = useArchives()
  const { t } = useTranslation('article')

  if (error) {
    return <div className={styles.status}>归档加载失败，请稍后再试。</div>
  }

  if (isLoading || !data) {
    return <div className={styles.status}>加载中...</div>
  }

  const { years = [], total = 0 } = data
  const hasArticles = years.length > 0

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Archives</h1>
        <p className={styles.subtitle}>{hasArticles ? `共 ${total} 篇文章` : '暂未发布文章'}</p>
      </header>

      <div className={styles.yearList}>
        {years.map((year) => {
          const articles = year.months
            .flatMap((month) => month.articles)
            .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())

          return (
            <section key={year.year} className={styles.yearSection}>
              <h2 className={styles.yearTitle}>{year.year}</h2>
              <ul className={styles.postList}>
                {articles.map((article) => (
                  <li key={`${year.year}-${article.id}`} className={styles.postItem}>
                    <time className={styles.postDate} dateTime={article.createdAt}>
                      {dayjs(article.createdAt).format('MM-DD')}
                    </time>
                    <Link
                      to={article.slug ? `/posts/${article.slug}` : `/article/${article.id}`}
                      className={styles.postLink}
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <section className={styles.chain} aria-labelledby="chain-meta-title">
        <h2 id="chain-meta-title" className={styles.chainTitle}>
          {t('ownership.title')}
        </h2>
        <dl className={styles.chainList}>
          <div>
            <dt>{t('ownership.owner')}</dt>
            <dd>{OWNERSHIP_INFO.owner}</dd>
          </div>
          <div>
            <dt>{t('ownership.creationTx')}</dt>
            <dd>
              <a href={OWNERSHIP_INFO.creationTxUrl} target="_blank" rel="noreferrer">
                {OWNERSHIP_INFO.creationTx}
              </a>
            </dd>
          </div>
          <div>
            <dt>{t('ownership.updateTx')}</dt>
            <dd>
              <a href={OWNERSHIP_INFO.lastUpdateTxUrl} target="_blank" rel="noreferrer">
                {OWNERSHIP_INFO.lastUpdateTx}
              </a>
            </dd>
          </div>
          <div>
            <dt>{t('ownership.ipfs')}</dt>
            <dd>
              <a href={OWNERSHIP_INFO.ipfsGateway} target="_blank" rel="noreferrer">
                {OWNERSHIP_INFO.ipfsHash}
              </a>
            </dd>
          </div>
        </dl>
      </section>
    </section>
  )
}

export default ArchivesPage
