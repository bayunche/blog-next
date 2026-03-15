import type { Article } from './article'
import type { Category } from './category'
import request from './request'

export interface Tag {
    name: string
    count: number
}

export interface TagQueryParams {
    page?: number
    pageSize?: number
    keyword?: string
    preview?: number
}

export interface PublicTagDetailResponse {
    tag: {
        name: string
        displayName: string
    }
    rows: Article[]
    count: number
    relatedTags: Tag[]
    relatedCategories: Category[]
}

export const tagApi = {
    getList: () => {
        return request.get<unknown, Tag[]>('/tag')
    },

    getPublicList: () => {
        return request.get<unknown, Tag[]>('/tag/public')
    },

    getPublicDetail: (name: string, params?: TagQueryParams) => {
        return request.get<unknown, PublicTagDetailResponse>(`/tag/public/${encodeURIComponent(name)}`, { params })
    },

    update: (name: string, newName: string) => {
        return request.put<unknown, void>(`/tag/${name}`, { newName })
    },

    delete: (name: string) => {
        return request.delete<unknown, void>(`/tag/${name}`)
    },
}
