import { 
    searchLoginTermQueryValidator, 
    searchEmailTermQueryValidator, 
    sortByQueryValidator, 
    sortDirectionQueryValidator, 
    pageNumberQueryValidator, 
    pageSizeQueryValidator 
} from "../../../common/validators/defaultQueryParamsValidator"

export const queryUsersParamsValidator = [
    searchLoginTermQueryValidator,
    searchEmailTermQueryValidator,
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
]