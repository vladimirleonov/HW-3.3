import { 
    searchNameTermQueryValidator, 
    sortByQueryValidator, 
    sortDirectionQueryValidator, 
    pageNumberQueryValidator, 
    pageSizeQueryValidator 
} from "../../../common/validators/defaultQueryParamsValidator"

export const queryBlogsParamsValidator = [
    searchNameTermQueryValidator,
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
]