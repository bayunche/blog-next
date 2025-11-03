import dayjs from 'dayjs'
import { Link, useParams } from 'react-router-dom'
import { useTagDetail } from '../hooks'
import styles from './TagDetailPage.module.less'

export function TagDetailPage() {
  const params = useParams<{ name: string }>()
  const tagSlug = decodeURIComponent(params.name ?? '')
  const { data, isLoading, error } = useTagDetail({ name: tagSlug })

  if (!tagSlug) {
    return <div className={styles.status}>未找到标签。</div>
  }

  if (error) {
    return <div className={styles.status}>标签加载失败，请稍后再试。</div>
  }

  if (isLoading || !data) {
    return <div className={styles.status}>加载中...</div>
  }

  const articles = data.articles?.list ?? []

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.subtitle}>Tag</p>
        <h1 className={styles.title}>#{data.tag.name}</h1>
        <p className={styles.count}>共 {articles.length} 篇文章</p>
      </header>

      {articles.length === 0 ? (
        <div className={styles.status}>该标签暂无文章。</div>
      ) : (
        <ul className={styles.postList}>
          {articles.map((article) => (
            <li key={article.id} className={styles.postItem}>
              <time className={styles.postDate} dateTime={article.createdAt}>
                {dayjs(article.createdAt).format('YYYY-MM-DD')}
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
      )}
    </section>
  )
}

export default TagDetailPage
