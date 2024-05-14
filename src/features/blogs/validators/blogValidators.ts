import {body, param, query} from "express-validator"
import {ObjectId} from "mongodb"

// body validator

const blogTitleInputValidator = body('name')
    .isString().withMessage('name is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('name is empty')
    .isLength({max: 15}).withMessage('name must be less than 15 characters long')

const blogDescriptionInputValidator = body('description')
    .isString().withMessage('description is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('description is required')
    .isLength({max: 500}).withMessage('description must be less than 500 characters long')

const blogWebsiteUrlInputValidator = body('websiteUrl')
    .isString().withMessage('websiteUrl is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('websiteUrl is required')
    .isLength({max: 100}).withMessage('websiteUrl must be less than 100 characters long')
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)

export const blogInputValidator = [
    blogTitleInputValidator,
    blogDescriptionInputValidator,
    blogWebsiteUrlInputValidator
]


// id param validator

const validateObjectId = async (objectId: string) => {
    if (!ObjectId.isValid(objectId)) {
        throw new Error('Invalid ObjectId')
    }
}

export const idParamValidator = param('id')
    .custom(validateObjectId).withMessage('Invalid ObjectId')


// query param validator

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

export const blogQueryValidator = [
    searchNameTermQueryValidator,
    sortByQueryValidator,
    sortDirectionQueryValidator,
    pageNumberQueryValidator,
    pageSizeQueryValidator
]