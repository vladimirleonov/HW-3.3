import {DefaultQueryParamsInputType} from "../../../common/input-output-types/common-types"

export type UsersQueryParamsInputType = DefaultQueryParamsInputType & {
    searchLoginTerm?: string
    searchEmailTerm?: string
}

export type UserBodyInputType = {
    login: string
    password: string
    email: string
}

export type BaseUserOutputType = {
    login: string
    email: string
}

export type AuthenticatedUserOutputType = BaseUserOutputType & {
    userId: string
}

export type DetailedUserOutputType = BaseUserOutputType & {
    id: string
    createdAt: string
}

export type UserPaginationOutputType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: DetailedUserOutputType[]
}