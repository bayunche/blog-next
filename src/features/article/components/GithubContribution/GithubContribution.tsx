/**
 * GitHub 贡献热力图组件
 */
import { useMemo } from 'react'
import { Card, Spin, Alert, Empty, Typography } from 'antd'
import ReactCalendarHeatmap from 'react-calendar-heatmap'
import dayjs from 'dayjs'
import { useGithubContributions } from '@features/article/hooks'
import styles from './GithubContribution.module.less'
import 'react-calendar-heatmap/dist/styles.css'

const { Paragraph, Text } = Typography

const COLOR_LEVELS = 4

export function GithubContribution() {
  const { data, isLoading, isError, error } = useGithubContributions()

  const { startDate, endDate, values, maxCount } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        startDate: dayjs().subtract(1, 'year').toDate(),
        endDate: new Date(),
        values: [],
        maxCount: 0,
      }
    }

    const sorted = [...data].sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
    const min = dayjs(sorted[0].date).toDate()
    const max = dayjs(sorted[sorted.length - 1].date).toDate()
    const peak = sorted.reduce((acc, item) => Math.max(acc, item.count), 0)

    return {
      startDate: min,
      endDate: max,
      values: sorted,
      maxCount: peak,
    }
  }, [data])

  const getLevelClass = (count?: number) => {
    if (!count || maxCount === 0) {
      return 'color-empty'
    }

    const ratio = count / maxCount
    const level = Math.min(COLOR_LEVELS, Math.floor(ratio * COLOR_LEVELS) + 1)
    return `color-scale-${level}`
  }

  const tooltipAttrs = (value: { date?: string; count?: number }) => {
    if (!value?.date) {
      return {}
    }

    const formattedDate = dayjs(value.date).format('YYYY-MM-DD')
    const count = value.count ?? 0
    return {
      'data-tip': `${formattedDate}: ${count} contributions`,
    }
  }

  return (
    <Card title="GitHub Contributions" className={styles.container} bordered>
      {isLoading ? (
        <div className={styles.state} data-testid="github-contribution-loading">
          <Spin tip="Fetching GitHub contributions..." />
        </div>
      ) : isError ? (
        <Alert
          type="error"
          showIcon
          message="Failed to load GitHub contributions"
          description={error instanceof Error ? error.message : 'Please try again later'}
        />
      ) : values.length === 0 ? (
        <Empty description="No contributions recorded" />
      ) : (
        <div className={styles.heatmapWrapper}>
          <ReactCalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={values}
            classForValue={(value) => getLevelClass(value?.count)}
            tooltipDataAttrs={tooltipAttrs}
            showWeekdayLabels
          />
          <Paragraph type="secondary" className={styles.caption}>
            <Text>The chart reflects public GitHub contribution records within the last year.</Text>
          </Paragraph>
        </div>
      )}
    </Card>
  )
}

export default GithubContribution
