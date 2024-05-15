import {BlogDBType} from "../db/db-types/blog-db-types";

export type QueryParamsType = {
    searchNameTerm?: string,
    sortBy?: keyof BlogDBType,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number
}

export type InputIdParamType = {
    id: string
}