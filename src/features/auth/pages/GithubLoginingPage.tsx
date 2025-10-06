/**
 * GitHub 登录中页面
 * 负责展示跳转提示并触发 OAuth 授权
 */
import { useEffect, useRef } from "react"
import { Spin, Result, Alert, Typography } from "antd"
import { useGithubAuth } from "../hooks"

const { Paragraph, Text } = Typography

export function GithubLoginingPage() {
  const hasStartedRef = useRef(false)
  const { isGithubAuthAvailable, startGithubAuth, isProcessing, error } = useGithubAuth()

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
          title="GitHub OAuth 未配置"
          subTitle="请联系管理员配置 VITE_GITHUB_CLIENT_ID 环境变量后再试"
          extra={
            <a href="/" style={{ color: "var(--primary-color)" }}>
              返回首页
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
      <Spin size="large" spinning={isProcessing ?? true} tip="正在跳转 GitHub，请稍候..." />
      <div style={{ maxWidth: "420px", textAlign: "center" }}>
        <Paragraph>
          <Text>即将跳转至 GitHub 完成授权，授权成功后会自动返回博客。</Text>
        </Paragraph>
        <Paragraph type="secondary">
          如果长时间没有跳转，请手动刷新页面或检查浏览器是否拦截弹出窗口。
        </Paragraph>
      </div>
      {error && (
        <Alert
          message="登录失败"
          description={error.message || "GitHub 登录失败，请稍后重试"}
          type="error"
          showIcon
        />
      )}
    </div>
  )
}

export default GithubLoginingPage
