import type { Article } from './article'
import type { Tag } from './tag'
import request from './request'

export interface Category {
    name: string
    count: number
}

export interface CategoryQueryParams {
    page?: number
    pageSize?: number
    keyword?: string
    preview?: number
}

export interface PublicCategoryDetailResponse {
    category: {
        name: string
        displayName: string
        isUncategorized?: boolean
    }
    rows: Article[]
    count: number
    relatedTags: Tag[]
}

export const categoryApi = {
    getList: () => {
        return request.get<unknown, Category[]>('/category')
    },

    getPublicList: () => {
        return request.get<unknown, Category[]>('/category/public')
    },

    getPublicDetail: (name: string, params?: CategoryQueryParams) => {
        return request.get<unknown, PublicCategoryDetailResponse>(`/category/public/${encodeURIComponent(name)}`, { params })
    },

    update: (name: string, newName: string) => {
        return request.put<unknown, void>(`/category/${name}`, { newName })
    },

    delete: (name: string) => {
        return request.delete<unknown, void>(`/category/${name}`)
    },
}
