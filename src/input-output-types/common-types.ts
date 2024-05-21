import {BlogDBType} from "../db/db-types/blog-db-types";

export type InputDefaultQueryParamsType = {
    searchNameTerm?: string,
    sortBy?: keyof BlogDBType,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number
}

export type InputBlogsQueryParamsType = InputDefaultQueryParamsType &{
    searchNameTerm?: string,
}

export type InputIdParamType = {
    id: string
}