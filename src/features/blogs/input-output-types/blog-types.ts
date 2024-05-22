import {InputDefaultQueryParamsType} from "../../../common/input-output-types/common-types";

export type InputBlogIdParamType = {
    blogId: string
}

export type InputBlogsQueryParamsType = InputDefaultQueryParamsType & {
    searchNameTerm?: string
}

export type InputBlogType = {
    name: string
    description: string
    websiteUrl: string
}

export type OutputBlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type OutputBlogPaginationType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputBlogType[]
}