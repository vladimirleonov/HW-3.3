import {InputDefaultQueryParamsType} from "../../../common/input-output-types/common-types";

export type InputUsersQueryParamsType = InputDefaultQueryParamsType & {
    searchLoginTerm?: string
    searchEmailTerm?: string
}

export type InputUserType = {
    login: string
    password: string
    email: string
}

export type OutputUserType = {
    id: string
    login: string
    email: string
}

export type OutputUserPaginationType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputUserType[]
}