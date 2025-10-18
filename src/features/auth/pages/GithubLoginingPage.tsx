/**
 * GitHub 登录中页面
 * 负责展示跳转提示并触发 OAuth 授权
 */
import { useEffect, useRef } from "react"
import { Spin, Result, Alert, Typography } from "antd"
import { useGithubAuth } from "../hooks"
import { useTranslation } from "react-i18next"

const { Paragraph, Text } = Typography

export function GithubLoginingPage() {
  const hasStartedRef = useRef(false)
  const { isGithubAuthAvailable, startGithubAuth, isProcessing, error } = useGithubAuth()
  const { t } = useTranslation('auth')

  useEffect(() => {
    if (isGithubAuthAvailable && !hasStartedRef.current) {
      hasStartedRef.current = true
      startGithubAuth()
    }
  }, [isGithubAuthAvailable, startGithubAuth])

  if (!isGithubAuthAvailable) {
    return (
      <div style={{ padding: "2rem" }}>
        <Result
          status="warning"
          title={t('github.unavailableTitle')}
          subTitle={t('github.unavailableSubtitle')}
          extra={
            <a href="/" style={{ color: "var(--primary-color)" }}>
              {t('github.backHome')}
            </a>
          }
        />
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        gap: "1.5rem",
      }}
    >
      <Spin size="large" spinning={isProcessing ?? true} tip={t('github.redirecting')} />
      <div style={{ maxWidth: "420px", textAlign: "center" }}>
        <Paragraph>
          <Text>{t('github.redirectingDesc')}</Text>
        </Paragraph>
        <Paragraph type="secondary">
          {t('github.redirectingHint')}
        </Paragraph>
      </div>
      {error && (
        <Alert
          message={t('github.errorTitle')}
          description={error.message || t('github.errorDefault')}
          type="error"
          showIcon
        />
      )}
    </div>
  )
}

export default GithubLoginingPage
