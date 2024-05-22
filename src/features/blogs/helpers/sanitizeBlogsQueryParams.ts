import {InputBlogsQueryParamsType} from "../input-output-types/blog-types";
import {sanitizeDefaultQueryParams} from "../../../common/helpers/queryParamsSanitizer";

export type SanitizedBlogsQueryParamsType = {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number
};

export const sanitizeBlogsQueryParams = (query: InputBlogsQueryParamsType): SanitizedBlogsQueryParamsType => {
    return {
        searchNameTerm: query.searchNameTerm || null,
        ...sanitizeDefaultQueryParams(query)
    }
}