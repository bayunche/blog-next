import request from './request'

export interface Tag {
    name: string
    count: number
}

export const tagApi = {
    getList: () => {
        return request.get<any, Tag[]>('/tag')
    },

    update: (name: string, newName: string) => {
        return request.put<any, void>(`/tag/${name}`, { newName })
    },

    delete: (name: string) => {
        return request.delete<any, void>(`/tag/${name}`)
    },
}
