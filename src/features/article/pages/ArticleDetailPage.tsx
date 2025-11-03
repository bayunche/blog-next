import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useArticleDetail } from '../hooks'
import { MarkdownRenderer } from '../components/MarkdownRenderer'
import { ArticleMusicPlayer } from '../components/ArticleMusicPlayer'
import { useLanguage } from '@shared/hooks'
import type { ArticleMusic } from '../types'
import styles from './ArticleDetailPage.module.less'

const LOCALE_TO_LANG = {
  zh: 'zh-CN',
  en: 'en-US',
  'zh-TW': 'zh-TW',
} as const

type LocaleKey = keyof typeof LOCALE_TO_LANG
type LanguageKey = (typeof LOCALE_TO_LANG)[LocaleKey]

const DEFAULT_LOCALE: LocaleKey = 'zh'

const LOCALE_OPTIONS: Array<{ value: LocaleKey; labelKey: LanguageKey }> = [
  { value: 'zh', labelKey: 'zh-CN' },
  { value: 'en', labelKey: 'en-US' },
  { value: 'zh-TW', labelKey: 'zh-TW' },
]

export function ArticleDetailPage() {
  const params = useParams<{ id?: string; slug?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t, i18n } = useTranslation('article')
  const { t: tCommon } = useTranslation('common')
  const { setLanguage } = useLanguage()

  const rawLocale = (searchParams.get('locale') ?? DEFAULT_LOCALE) as string
  const localeKey: LocaleKey = rawLocale in LOCALE_TO_LANG ? (rawLocale as LocaleKey) : DEFAULT_LOCALE
  const languageKey = LOCALE_TO_LANG[localeKey]

  const [hasTriedFallback, setHasTriedFallback] = useState(false)

  useEffect(() => {
    if (i18n.language !== languageKey) {
      setLanguage(languageKey)
    }
  }, [i18n.language, languageKey, setLanguage])

  const articleQuery = useArticleDetail({
    id: params.id ? Number(params.id) : undefined,
    slug: params.slug,
    locale: localeKey,
  })
  const { data: article, isLoading, error } = articleQuery

  const queryMusicId = searchParams.get('musicId') ?? undefined
  const queryMusicServer = searchParams.get('musicServer') ?? 'netease'
  const queryMusicType = searchParams.get('musicType') ?? 'song'
  const queryMusicAutoplay = searchParams.get('musicAutoplay') === 'true'
  const queryMusicLrcType = searchParams.get('musicLrcType') ?? undefined

  const fallbackMusic = useMemo<ArticleMusic | null>(() => {
    if (!queryMusicId) return null
    return {
      server: queryMusicServer,
      type: queryMusicType,
      id: queryMusicId,
      autoplay: queryMusicAutoplay,
      lrcType: queryMusicLrcType,
    }
  }, [queryMusicAutoplay, queryMusicId, queryMusicLrcType, queryMusicServer, queryMusicType])

  const music = useMemo<ArticleMusic | null>(() => {
    if (article?.music) return article.music
    return fallbackMusic
  }, [article?.music, fallbackMusic])

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} · ${tCommon('app.title')}`
    } else {
      document.title = tCommon('app.title')
    }
  }, [article?.title, tCommon])

  useEffect(() => {
    if (!hasTriedFallback && error && localeKey !== DEFAULT_LOCALE) {
      setHasTriedFallback(true)
      const next = new URLSearchParams(searchParams)
      next.set('locale', DEFAULT_LOCALE)
      setSearchParams(next, { replace: true })
    }
  }, [error, hasTriedFallback, localeKey, searchParams, setSearchParams])

  const references = useMemo(() => article?.references ?? [], [article?.references])

  const handleLocaleChange = (value: LocaleKey) => {
    if (value === localeKey) return
    const next = new URLSearchParams(searchParams)
    next.set('locale', value)
    setHasTriedFallback(false)
    setSearchParams(next, { replace: true })
  }

  if (error && localeKey === DEFAULT_LOCALE) {
    return <div className={styles.status}>{t('error.title')}</div>
  }

  if (isLoading || !article) {
    return <div className={styles.status}>{t('loading')}</div>
  }

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerMeta}>
          <div className={styles.metaLine} aria-label={t('meta.info', { defaultValue: '文章信息' })}>
            {article.category?.name && (
              <span className={styles.metaItem}>{article.category.name}</span>
            )}
            <span className={styles.metaDivider} aria-hidden="true">·</span>
            <time className={styles.metaItem} dateTime={article.createdAt}>
              {dayjs(article.createdAt).format('YYYY-MM-DD')}
            </time>
            {article.updatedAt && (
              <>
                <span className={styles.metaDivider} aria-hidden="true">·</span>
                <span className={styles.metaItem}>
                  {t('meta.updatedAtShort', {
                    defaultValue: '更新于',
                    date: dayjs(article.updatedAt).format('YYYY-MM-DD'),
                  })}
                </span>
              </>
            )}
          </div>
          <ul className={styles.localeSwitch} aria-label={t('meta.localeSwitcher', { defaultValue: '切换语言' })}>
            {LOCALE_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  className={[
                    styles.localeButton,
                    option.value === localeKey ? styles.localeButtonActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleLocaleChange(option.value)}
                >
                  {tCommon(`languages.${option.labelKey}` as const)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <h1 className={styles.title}>{article.title}</h1>
      </header>

      {music && (
        <section className={styles.musicSection} aria-label={t('meta.musicPlayer', { defaultValue: '文章配乐' })}>
          <ArticleMusicPlayer music={music} />
        </section>
      )}

      <div className={styles.content}>
        <MarkdownRenderer content={article.content ?? ''} />
      </div>

      {(article.tags?.length ?? 0) > 0 && (
        <ul className={styles.tags} aria-label={t('meta.tags', { defaultValue: '文章标签' })}>
          {article.tags?.map((tag) => (
            <li key={tag.id}>#{tag.name}</li>
          ))}
        </ul>
      )}

      {references.length > 0 && (
        <section className={styles.references} aria-labelledby="references-title">
          <h2 id="references-title">{t('references.title')}</h2>
          <ul>
            {references.map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.title || item.url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

    </article>
  )
}

export default ArticleDetailPage
