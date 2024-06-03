import {BlogDBType} from "../../db/db-types/blog-db-types"

export type DefaultQueryParamsInputType = {
    sortBy?: keyof BlogDBType,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number
}

export type IdParamInputType = {
    id: string
}