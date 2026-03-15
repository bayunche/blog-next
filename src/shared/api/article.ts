import request from './request'

export interface Article {
    id: number
    title: string
    content: string
    createdAt: string
    updatedAt: string
    viewCount: number
    cover?: string
    cardCover?: string
    description?: string
    music?: unknown
    musicId?: string | null
    musicName?: string | null
    category?: { id: number; name: string }
    categories?: { id: number; name: string }[]
    tags?: { id: number; name: string }[]
    comments?: Array<{
        id: number
        content: string
        createdAt: string
        replies?: Array<{ id: number; content: string; createdAt: string }>
    }>
    // Add other fields as needed based on backend response
}

export interface ArticleListParams {
    page?: number
    pageSize?: number
    keyword?: string
    tagId?: number
    categoryId?: number
    tag?: string
    category?: string
    preview?: number
    order?: string
    type?: boolean
}

export interface ArticleListResponse {
    rows: Article[]
    count: number
}

// 归档数据类型
export interface ArchiveArticle {
    id: number
    title: string
    description?: string
    cover?: string
    cardCover?: string
    viewCount: number
    likeCount?: number
    commentCount: number
    category?: { id: number; name: string } | null
    tags: { id: number; name: string }[]
    createdAt: string
    updatedAt: string
}

export interface ArchiveMonth {
    month: number
    count: number
    articles: ArchiveArticle[]
}

export interface ArchiveYear {
    year: number
    count: number
    months: ArchiveMonth[]
}

export const articleApi = {
    getList: (params: ArticleListParams) => {
        return request.get<unknown, ArticleListResponse>('/article/list', { params })
    },

    getDetail: (id: number | string) => {
        return request.get<unknown, Article>(`/article/${id}`)
    },

    create: (data: Partial<Article>) => {
        return request.post<unknown, Article>('/article', data)
    },

    update: (id: number | string, data: Partial<Article>) => {
        return request.put<unknown, Article>(`/article/${id}`, data)
    },

    delete: (id: number | string) => {
        return request.delete<unknown, void>(`/article/${id}`)
    },

    getArchives: () => {
        return request.get<unknown, ArchiveYear[]>('/article/archives')
    },
}

