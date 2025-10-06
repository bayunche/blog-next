
import { describe, it, expect } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { buildArchiveTimeline } = require('../archive')

describe('buildArchiveTimeline', () => {
  it('����ݺ��·ݾۺ����²���������', () => {
    const articles = [
      {
        id: 1,
        title: 'A',
        description: 'desc',
        cover: null,
        viewCount: 10,
        likeCount: 2,
        createdAt: '2024-05-01 10:00:00',
        updatedAt: '2024-05-02 10:00:00',
        categories: [{ id: 7, name: 'ǰ��' }],
        tags: [{ id: 1, name: 'React' }],
        comments: [{ id: 1 }],
      },
      {
        id: 2,
        title: 'B',
        description: '',
        cover: null,
        viewCount: 5,
        likeCount: 1,
        createdAt: '2024-05-10 12:00:00',
        updatedAt: '2024-05-11 12:00:00',
        categories: [{ id: 8, name: '���' }],
        tags: [],
        comments: [],
      },
      {
        id: 3,
        title: 'C',
        description: '',
        cover: null,
        viewCount: 3,
        likeCount: 0,
        createdAt: '2023-12-20 08:00:00',
        updatedAt: '2023-12-21 08:00:00',
        categories: [],
        tags: [],
        comments: [],
      },
    ]

    const result = buildArchiveTimeline(articles)

    expect(result.total).toBe(3)
    expect(result.years).toHaveLength(2)
    expect(result.years[0].year).toBe(2024)
    expect(result.years[0].count).toBe(2)
    expect(result.years[0].months[0].month).toBe(5)
    expect(result.years[0].months[0].count).toBe(2)
    expect(result.years[0].months[0].articles[0].id).toBe(2)
    expect(result.years[0].months[0].articles[1].id).toBe(1)
    expect(result.years[1].year).toBe(2023)
  })

  it('�����޷�����ʱ��ļ�¼', () => {
    const articles = [
      { id: 1, title: 'bad', createdAt: 'invalid', updatedAt: 'invalid', comments: [] },
    ]

    const result = buildArchiveTimeline(articles)

    expect(result.total).toBe(1)
    expect(result.years).toHaveLength(0)
  })
})
