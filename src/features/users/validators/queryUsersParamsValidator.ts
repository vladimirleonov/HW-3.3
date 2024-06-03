import {
    searchLoginTermQueryValidator,
    searchEmailTermQueryValidator,
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
} from "../../../common/validators/queryParamValidators"

export const queryUsersParamsValidator = [
    searchLoginTermQueryValidator,
    searchEmailTermQueryValidator,
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
]