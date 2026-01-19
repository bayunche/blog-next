import request from './request'

export interface Article {
    id: number
    title: string
    content: string
    createdAt: string
    updatedAt: string
    viewCount: number
    cover?: string
    music?: any
    category?: { id: number; name: string }
    tags?: { id: number; name: string }[]
    // Add other fields as needed based on backend response
}

export interface ArticleListParams {
    page?: number
    pageSize?: number
    keyword?: string
    tagId?: number
    categoryId?: number
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
        return request.get<any, ArticleListResponse>('/article/list', { params })
    },

    getDetail: (id: number | string) => {
        return request.get<any, Article>(`/article/${id}`)
    },

    create: (data: Partial<Article>) => {
        return request.post<any, Article>('/article', data)
    },

    update: (id: number | string, data: Partial<Article>) => {
        return request.put<any, Article>(`/article/${id}`, data)
    },

    delete: (id: number | string) => {
        return request.delete<any, void>(`/article/${id}`)
    },

    getArchives: () => {
        return request.get<any, ArchiveYear[]>('/article/archives')
    },
}

