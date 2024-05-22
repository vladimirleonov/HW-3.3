import { 
    sortByQueryValidator, 
    sortDirectionQueryValidator, 
    pageNumberQueryValidator, 
    pageSizeQueryValidator 
} from "../../../common/validators/defaultQueryParamsValidator"

export const queryBlogPostsParamsValidator = [
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
]