import {InputQueryParamsType} from "../input-output-types/common-types";

export type SanitizedQueryParamsType = {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number
};

export const sanitizeDefaultQueryParams = (query: InputQueryParamsType): SanitizedQueryParamsType => {
    return {
        searchNameTerm: query.searchNameTerm || null,
        sortBy: query.sortBy || 'createdAt',
        sortDirection: query.sortDirection || "desc",
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize ? +query.pageSize : 10,
    }
}

export const satitizePostsQueryParams = () => {

}

