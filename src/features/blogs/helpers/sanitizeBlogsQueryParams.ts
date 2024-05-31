import {BlogsQueryParamsInputType} from "../input-output-types/blog-types";
import {
    SanitizedDefaultQueryParamsType,
    sanitizeDefaultQueryParams
} from "../../../common/helpers/queryParamsSanitizer";

export type SanitizedBlogsQueryParamsType = SanitizedDefaultQueryParamsType & {
    searchNameTerm: string | null,
};

export const sanitizeBlogsQueryParams = (query: BlogsQueryParamsInputType): SanitizedBlogsQueryParamsType => {
    return {
        searchNameTerm: query.searchNameTerm || null,
        ...sanitizeDefaultQueryParams(query)
    }
}