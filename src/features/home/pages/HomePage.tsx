import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  GithubOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  SendOutlined,
  MailOutlined,
  CloudOutlined,
  PlayCircleOutlined,
  ConsoleSqlOutlined,
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@shared/hooks'
import { useArticleList } from '@features/article/hooks'
import dayjs from 'dayjs'
import styles from './HomePage.module.less'

const LOCALE_TO_LANG: Record<string, 'zh-CN' | 'en-US' | 'zh-TW'> = {
  zh: 'zh-CN',
  en: 'en-US',
  'zh-TW': 'zh-TW',
}

const SOCIAL_LINKS = [
  { key: 'github', icon: <GithubOutlined />, href: 'https://github.com/bayunche', label: 'GitHub' },
  { key: 'twitter', icon: <TwitterOutlined />, href: 'https://twitter.com/bayunche', label: 'Twitter' },
  { key: 'bilibili', icon: <YoutubeOutlined />, href: 'https://space.bilibili.com/32226262', label: 'Bilibili' },
  { key: 'email', icon: <MailOutlined />, href: 'mailto:bayunche@gmail.com', label: 'Email' },
  { key: 'steam', icon: <CloudOutlined />, href: 'https://steamcommunity.com/profiles/76561198296312244/', label: 'Steam' },
  
]

export function HomePage() {
  const { t } = useTranslation('home')
  const { t: tCommon } = useTranslation('common')
  const { setLanguage } = useLanguage()
  const [searchParams] = useSearchParams()

  const { data, isLoading, error } = useArticleList({
    params: {
      page: 1,
      pageSize: 6,
      orderBy: 'createdAt',
      order: 'DESC',
    },
  })

  const localeParam = searchParams.get('locale') ?? 'zh'
  const languageKey = LOCALE_TO_LANG[localeParam] ?? 'zh-CN'

  useEffect(() => {
    setLanguage(languageKey)
  }, [languageKey, setLanguage])

  useEffect(() => {
    document.title = tCommon('app.title')
  }, [tCommon])

  const articles = useMemo(() => data?.list ?? [], [data?.list])

  const renderFeed = () => {
    if (isLoading) {
      return (
        <div className={styles.feedPlaceholder} role="status">
          {t('feed.loading')}
        </div>
      )
    }

    if (error) {
      return (
        <div className={styles.feedError} role="alert">
          {t('feed.error')}
        </div>
      )
    }

    if (articles.length === 0) {
      return <div className={styles.feedEmpty}>{t('feed.empty')}</div>
    }

    return (
      <ul className={styles.feedList}>
        {articles.map((article) => {
          const articleHref = article.slug ? `/posts/${article.slug}` : `/article/${article.id}`
          const description = article.description?.trim() || ''
          const trimmedDescription =
            description.length > 140 ? `${description.slice(0, 140)}…` : description

          return (
            <li key={article.id} className={styles.feedItem}>
              <div className={styles.feedMeta}>
                <time dateTime={article.createdAt}>
                  {dayjs(article.createdAt).format('YYYY-MM-DD')}
                </time>
                <span>{article.category?.name ?? t('feed.uncategorized')}</span>
              </div>
              <Link to={articleHref} className={styles.feedTitle}>
                {article.title}
              </Link>
              {trimmedDescription && (
                <p className={styles.feedDescription}>{trimmedDescription}</p>
              )}
              <div className={styles.feedTags}>
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag.id} className={styles.feedTag}>
                    #{tag.name}
                  </span>
                ))}
              </div>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="homepage-title">
        <h1 id="homepage-title" className={styles.title}>
          {t('headline')}
        </h1>
        <p className={styles.subtitle}>{t('subline')}</p>
        <p className={styles.description}>{t('description')}</p>
      </section>

      <nav className={styles.social} aria-label="Social links">
        {SOCIAL_LINKS.map((item) => (
          <a key={item.key} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
            <span className={styles.socialIcon}>{item.icon}</span>
            <span className={styles.socialName}>{item.label}</span>
          </a>
        ))}
      </nav>

      <section className={styles.feed} aria-labelledby="homepage-feed-title">
        <div className={styles.feedHeader}>
          <div>
            <h2 id="homepage-feed-title" className={styles.feedTitleHeader}>
              {t('feed.title')}
            </h2>
            <p className={styles.feedSubtitle}>{t('feed.subtitle')}</p>
          </div>
          <Link className={styles.feedMore} to="/feed">
            {t('feed.viewAll')}
          </Link>
        </div>

        {renderFeed()}
      </section>
    </main>
  )
}

export default HomePage
