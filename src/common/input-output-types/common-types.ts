import {BlogDBType} from "../../db/models/blog.model"

export type DefaultQueryParamsInputType = {
    sortBy?: keyof BlogDBType,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number
}

export type IdParamInputType = {
    id: string
}