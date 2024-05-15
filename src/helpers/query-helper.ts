import {BlogQueryParamsType} from "../input-output-types/blog-types";

export type SanitizedBlogQueryParamsType = {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number
};

export const sanitizeBlogQueryParams = (query: BlogQueryParamsType): SanitizedBlogQueryParamsType => {
    return {
        searchNameTerm: query.searchNameTerm || null,
        sortBy: query.sortBy || 'createdAt',
        sortDirection: query.sortDirection || "desc",
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize ? +query.pageSize : 10,
    }
}