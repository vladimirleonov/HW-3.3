import {body, param} from "express-validator"
import {ObjectId} from "mongodb"

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

const validateObjectId = async (objectId: string) => {
    if (!ObjectId.isValid(objectId)) {
        throw new Error('Invalid ObjectId')
    }
}

export const idParamValidator = param('id')
    .custom(validateObjectId).withMessage('Invalid ObjectId')