/**
 * 关于页面
 * 以故事的形式介绍自己，分享爱好、项目和历程
 */

import { Typography, Divider, Space, Avatar } from 'antd'
import { GithubOutlined, MailOutlined, WechatOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { CommentList } from '@features/comment'
import styles from './AboutPage.module.less'

const { Title, Paragraph, Text, Link } = Typography

/**
 * 关于页面组件
 */
export function AboutPage() {
  const { t } = useTranslation('about')

  const hero = t('hero', { returnObjects: true }) as {
    title: string
    subtitle: string
    quote: string
    avatarAlt: string
  }

  const storyParagraphs = t('story.paragraphs', { returnObjects: true }) as string[]
  const projects = t('projects.items', { returnObjects: true }) as Array<{
    name: string
    description: string
    link: string
  }>
  const lifeParagraphs = t('life.paragraphs', { returnObjects: true }) as string[]
  const contact = t('contact', { returnObjects: true }) as {
    title: string
    description: string
    github: { label: string; url: string }
    email: { label: string; url: string }
    wechat: { label: string; value: string }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatarSection}>
        <Avatar
          size={150}
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          alt={hero.avatarAlt}
          style={{ marginBottom: '1.5rem' }}
        />
        <Title level={1}>{hero.title}</Title>
        <Text type="secondary">{hero.subtitle}</Text>
        <Paragraph className={styles.quote}>{hero.quote}</Paragraph>
      </div>

      <div className={styles.section}>
        <Title level={2}>{t('story.title')}</Title>
        {storyParagraphs.map((paragraph, index) => (
          <Paragraph key={`story-${index}`}>{paragraph}</Paragraph>
        ))}
      </div>

      <div className={styles.section}>
        <Title level={2}>{t('projects.title')}</Title>
        <Paragraph>{t('projects.intro')}</Paragraph>
        <ul>
          {projects.map((project) => (
            <li key={project.name}>
              <Link href={project.link} target="_blank">
                {project.name}
              </Link>
              ：{project.description}
            </li>
          ))}
        </ul>
        <Paragraph>
          {t('projects.more', {
            defaultValue: '你可以在我的 GitHub 上找到更多进行中的实验。',
          })}{' '}
          <Link href={contact.github.url} target="_blank">
            {contact.github.label}
          </Link>
        </Paragraph>
      </div>

      <div className={styles.section}>
        <Title level={2}>{t('life.title')}</Title>
        {lifeParagraphs.map((paragraph, index) => (
          <Paragraph key={`life-${index}`}>{paragraph}</Paragraph>
        ))}
      </div>

      <Divider />

      <div style={{ textAlign: 'center' }}>
        <Title level={3}>{contact.title}</Title>
        <Paragraph>{contact.description}</Paragraph>
        <Space size="large" wrap>
          <Link href={contact.github.url} target="_blank">
            <GithubOutlined style={{ fontSize: '1.5rem' }} /> {contact.github.label}
          </Link>
          <Link href={contact.email.url}>
            <MailOutlined style={{ fontSize: '1.5rem' }} /> {contact.email.label}
          </Link>
          <Text>
            <WechatOutlined style={{ fontSize: '1.5rem' }} /> {contact.wechat.label}：{contact.wechat.value}
          </Text>
        </Space>
      </div>

      <Divider />

      <div className={styles.section}>
        <CommentList articleId={-1} />
      </div>
    </div>
  )
}

export default AboutPage
