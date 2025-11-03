import { Link } from 'react-router-dom'
import { useTags } from '../hooks'
import styles from './TagsPage.module.less'

export function TagsPage() {
  const { data: tags, isLoading, error } = useTags()

  if (error) {
    return <div className={styles.status}>标签加载失败，请稍后再试。</div>
  }

  if (isLoading || !tags) {
    return <div className={styles.status}>加载中...</div>
  }

  if (tags.length === 0) {
    return <div className={styles.status}>暂无标签</div>
  }

  const ordered = [...tags].sort((a, b) => (b.articleCount ?? 0) - (a.articleCount ?? 0))

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tags</h1>
        <p className={styles.subtitle}>共 {ordered.length} 个标签</p>
      </header>

      <ul className={styles.tagList}>
        {ordered.map((tag) => (
          <li key={tag.id ?? tag.name} className={styles.tagItem}>
            <Link to={`/tag/${tag.name}`} className={styles.tagLink}>
              #{tag.name}
            </Link>
            <span className={styles.tagCount}>{tag.articleCount ?? 0}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TagsPage
