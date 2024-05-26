import { 
    sortByQueryValidator, 
    sortDirectionQueryValidator, 
    pageNumberQueryValidator, 
    pageSizeQueryValidator 
} from "../../../common/validators/queryParamValidators"

export const queryPostsParamsValidator = [
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
]