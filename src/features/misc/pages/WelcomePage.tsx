/**
 * 欢迎页，包含打字动画与快速引导
 */

import { useEffect, useState } from 'react'
import { Button, Space, Typography } from 'antd'
import { GithubOutlined, RightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './WelcomePage.module.less'

const { Title, Paragraph, Text } = Typography

const HEADLINE = '欢迎来到八云澈的 Blog'
const MESSAGES = [
  '和你们这些少爷不同，我们光是活着就竭尽全力了。',
  '开源仓库：github.com/bayunche/react-blog —— 欢迎 PR 与 Star。',
]

interface WelcomePageProps {
  typingInterval?: number
  revealDelay?: number
}

export function WelcomePage({ typingInterval = 90, revealDelay = 480 }: WelcomePageProps) {
  const navigate = useNavigate()
  const [typedText, setTypedText] = useState('')
  const [showMessages, setShowMessages] = useState(false)

  useEffect(() => {
    if (typingInterval <= 0) {
      if (typedText !== HEADLINE) {
        setTypedText(HEADLINE)
      }
      if (!showMessages) {
        setShowMessages(true)
      }
      return
    }

    if (typedText.length === HEADLINE.length) {
      if (showMessages) {
        return
      }
      const timer = setTimeout(() => setShowMessages(true), revealDelay)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setTypedText(HEADLINE.slice(0, typedText.length + 1))
    }, typingInterval)

    return () => clearTimeout(timer)
  }, [typedText, showMessages, typingInterval, revealDelay])

  const handleEnter = () => {
    navigate('/', { replace: true })
  }

  return (
    <section className={styles.welcome}>
      <div className={styles.overlay} />
      <div className={styles.bird} />
      <div className={styles.bird} />
      <div className={styles.bird} />

      <div className={styles.hero}>
        <Title level={1} className={styles.title}>
          八云澈的小站
        </Title>
        <Paragraph className={styles.typing}>{typedText}</Paragraph>

        {showMessages ? (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {MESSAGES.map((message) => (
              <Paragraph key={message} className={styles.message}>
                {message}
              </Paragraph>
            ))}
          </Space>
        ) : (
          <Paragraph className={styles.message}>
            <Text type="secondary">加载精彩内容中...</Text>
          </Paragraph>
        )}

        <div className={styles.actions}>
          <Button type="primary" size="large" icon={<RightOutlined />} onClick={handleEnter}>
            进入首页
          </Button>
          <Button
            size="large"
            icon={<GithubOutlined />}
            href="https://github.com/bayunche/react-blog"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </Button>
        </div>
      </div>
    </section>
  )
}

export default WelcomePage
