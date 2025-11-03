import { useTranslation } from 'react-i18next'
import { CommentList } from '@features/comment'
import styles from './AboutPage.module.less'

type HeroContent = {
  title: string
  tagline: string
  description: string
  meta: Array<{ label: string; value: string }>
  callToAction: string
  avatarAlt: string
}

type FocusItem = { title: string; description: string }
type StackGroup = { label: string; items: string[] }

export function AboutPage() {
  const { t } = useTranslation('about')

  const hero = t('hero', { returnObjects: true }) as HeroContent
  const narrative = t('narrative', { returnObjects: true }) as {
    title: string
    paragraphs: string[]
  }
  const focusItems = t('focus.items', { returnObjects: true }) as FocusItem[]
  const focusTitle = t('focus.title') as string
  const stackGroups = t('stack.groups', { returnObjects: true }) as StackGroup[]
  const stackTitle = t('stack.title') as string
  const values = t('values', { returnObjects: true }) as {
    title: string
    principles: string[]
  }
  const contact = t('contact', { returnObjects: true }) as {
    title: string
    description: string
    channels: Array<{ label: string; value: string; url?: string }>
  }
  const commentsTitle = t('comments.title', { defaultValue: '留言板' })

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroTagline}>{hero.tagline}</span>
          <h1 className={styles.heroTitle}>{hero.title}</h1>
          <p className={styles.heroDescription}>{hero.description}</p>
          <div className={styles.heroMeta}>
            {hero.meta.map((item) => (
              <div key={item.label} className={styles.metaChip}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
          <p className={styles.heroCTA}>{hero.callToAction}</p>
        </div>
        <div className={styles.heroArt}>
          <div className={styles.heroAvatarWrapper}>
            <img
              className={styles.heroAvatar}
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aya&radius=50"
              alt={hero.avatarAlt}
            />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="about-narrative">
        <div className={styles.sectionHeader}>
          <h2 id="about-narrative">{narrative.title}</h2>
          <span className={styles.sectionDivider} aria-hidden="true" />
        </div>
        <div className={styles.sectionBody}>
          {narrative.paragraphs.map((paragraph, index) => (
            <p key={`narrative-${index}`}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="about-focus">
        <div className={styles.sectionHeader}>
          <h2 id="about-focus">{focusTitle}</h2>
          <span className={styles.sectionDivider} aria-hidden="true" />
        </div>
        <div className={styles.focusGrid}>
          {focusItems.map((item) => (
            <article key={item.title} className={styles.focusCard}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="about-stack">
        <div className={styles.sectionHeader}>
          <h2 id="about-stack">{stackTitle}</h2>
          <span className={styles.sectionDivider} aria-hidden="true" />
        </div>
        <div className={styles.stackBoard}>
          {stackGroups.map((group) => (
            <div key={group.label} className={styles.stackColumn}>
              <span className={styles.stackLabel}>{group.label}</span>
              <div className={styles.stackTags}>
                {group.items.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="about-values">
        <div className={styles.sectionHeader}>
          <h2 id="about-values">{values.title}</h2>
          <span className={styles.sectionDivider} aria-hidden="true" />
        </div>
        <ul className={styles.valueList}>
          {values.principles.map((principle, index) => (
            <li key={`principle-${index}`}>{principle}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="about-contact">
        <div className={styles.sectionHeader}>
          <h2 id="about-contact">{contact.title}</h2>
          <span className={styles.sectionDivider} aria-hidden="true" />
        </div>
        <p className={styles.sectionIntro}>{contact.description}</p>
        <ul className={styles.contactList}>
          {contact.channels.map((channel) => (
            <li key={channel.label}>
              <span>{channel.label}</span>
              {channel.url ? (
                <a href={channel.url} target="_blank" rel="noreferrer">
                  {channel.value}
                </a>
              ) : (
                <em>{channel.value}</em>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="about-comments">
        <div className={styles.sectionHeader}>
          <h2 id="about-comments">{commentsTitle}</h2>
          <span className={styles.sectionDivider} aria-hidden="true" />
        </div>
        <CommentList articleId={-1} />
      </section>
    </main>
  )
}

export default AboutPage
