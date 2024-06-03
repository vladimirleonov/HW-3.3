import {query} from "express-validator";

export const sortByQueryValidator = query('sortBy')
    .optional()
    .isString().withMessage('sortBy is not a string')

export const sortDirectionQueryValidator = query('sortDirection')
    .optional()
    .isString().withMessage('sortDirection is not a string')
    .isIn(['asc', 'desc']).withMessage('sortDirection must be asc or desc')

export const pageNumberQueryValidator = query('pageNumber')
    .optional()
    .isInt({min: 1}).withMessage('pageNumber is not a positive integer')

export const pageSizeQueryValidator = query('pageSize')
    .optional()
    .isInt({min: 1}).withMessage('pageSize is not a positive integer')


export const searchNameTermQueryValidator = query('searchNameTerm')
    .optional()
    .isString().withMessage('searchNameTerm is not a string')


export const searchLoginTermQueryValidator = query('searchNameTerm')
    .optional()
    .isString().withMessage('searchLoginTerm is not a string')

export const searchEmailTermQueryValidator = query('searchNameTerm')
    .optional()
    .isString().withMessage('searchEmailTerm is not a string')