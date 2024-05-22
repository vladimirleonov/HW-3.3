import {InputDefaultQueryParamsType} from "../input-output-types/common-types";

export type SanitizedDefaultQueryParamsType = {
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number
};

export const sanitizeDefaultQueryParams = (query: InputDefaultQueryParamsType): SanitizedDefaultQueryParamsType => {
    return {
        sortBy: query.sortBy || 'createdAt',
        sortDirection: query.sortDirection || "desc",
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize ? +query.pageSize : 10,
    }
}