// query param validator

import {query} from "express-validator";

const searchNameTermQueryValidator = query('searchNameTerm')
    .optional()
    .isString().withMessage('searchNameTerm is not a string')

const sortByQueryValidator = query('sortBy')
    .optional()
    .isString().withMessage('sortBy is not a string')

const sortDirectionQueryValidator = query('sortDirection')
    .optional()
    .isString().withMessage('sortDirection is not a string')
    .isIn(['asc', 'desc']).withMessage('sortDirection must be asc or desc')

const pageNumberQueryValidator = query('pageNumber')
    .optional()
    .isInt({ min: 1 }).withMessage('pageNumber is not a positive integer')

const pageSizeQueryValidator = query('pageSize')
    .optional()
    .isInt({ min: 1 }).withMessage('pageSize is not a positive integer')

export const queryParamsValidator = [
    searchNameTermQueryValidator,
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
]