import request from './request'

export interface Category {
    name: string
    count: number
}

export const categoryApi = {
    getList: () => {
        return request.get<any, Category[]>('/category')
    },

    update: (name: string, newName: string) => {
        return request.put<any, void>(`/category/${name}`, { newName })
    },

    delete: (name: string) => {
        return request.delete<any, void>(`/category/${name}`)
    },
}
