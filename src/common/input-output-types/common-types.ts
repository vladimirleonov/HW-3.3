import {Blog} from "../../db/db-types/blog-db-types";

export type DefaultQueryParamsInputType = {
    sortBy?: keyof Blog,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number
}

export type IdParamInputType = {
    id: string
}