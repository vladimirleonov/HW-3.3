import {
    pageNumberQueryValidator,
    pageSizeQueryValidator,
    sortByQueryValidator,
    sortDirectionQueryValidator
} from "../../../common/validators/queryParamValidators"

export const queryPostCommentsParamsValidator = [
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
]