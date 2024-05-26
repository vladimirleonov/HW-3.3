import { 
    sortByQueryValidator, 
    sortDirectionQueryValidator, 
    pageNumberQueryValidator, 
    pageSizeQueryValidator 
} from "../../../common/validators/queryParamValidators"

export const queryBlogPostsParamsValidator = [
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
]