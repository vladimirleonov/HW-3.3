import {
    DefaultQueryParamsInputType,
} from "../../../common/input-output-types/common-types";

export type BlogIdParamInputType = {
    blogId: string
}

export type BlogsQueryParamsInputType = DefaultQueryParamsInputType & {
    searchNameTerm?: string
}

export type BlogBodyInputType = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogOutputType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogsPaginationOutputType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogOutputType[]
}