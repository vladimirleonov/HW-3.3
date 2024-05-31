import {
    SanitizedDefaultQueryParamsType,
    sanitizeDefaultQueryParams
} from "../../../common/helpers/queryParamsSanitizer";
import {UsersQueryParamsInputType} from "../input-output-types/user-types";

export type SanitizedUsersQueryParamsType = SanitizedDefaultQueryParamsType & {
    searchLoginTerm: string | null,
    searchEmailTerm: string | null
};

export const sanitizeUsersQueryParams = (query: UsersQueryParamsInputType): SanitizedUsersQueryParamsType  => {
    return {
        ...sanitizeDefaultQueryParams(query),
        searchLoginTerm: query.searchLoginTerm || null,
        searchEmailTerm: query.searchEmailTerm || null,
    }
}