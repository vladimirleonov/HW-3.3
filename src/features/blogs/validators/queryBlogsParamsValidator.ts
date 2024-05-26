import { 
    searchNameTermQueryValidator, 
    sortByQueryValidator, 
    sortDirectionQueryValidator, 
    pageNumberQueryValidator, 
    pageSizeQueryValidator 
} from "../../../common/validators/queryParamValidators"

export const queryBlogsParamsValidator = [
    searchNameTermQueryValidator,
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
]