import {body} from "express-validator"
import {BlogMongoRepository} from "../../blogs/repository/blogMongoRepository"
import {BlogDocument} from "../../../db/db-types/blog-db-types";

export const validateBlogId = async (blogId: string) => {
    const blog: BlogDocument | null = await new BlogMongoRepository().findById(blogId) //check count
    if (!blog) {
        throw new Error('invalid blogId')
    }
    return blogId === blog._id.toString()
}

const postTitleInputValidator = body('title')
    .isString().withMessage('title is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('title is empty')
    .isLength({max: 30}).withMessage('title must be less than 30 characters long')

const postShortDescriptionInputValidator = body('shortDescription')
    .isString().withMessage('shortDescription is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('shortDescription is empty')
    .isLength({max: 100}).withMessage('shortDescription must be less than 100 characters long')

const postContentInputValidator = body('content')
    .isString().withMessage('content is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('content is empty')
    .isLength({max: 1000}).withMessage('content must be less than 1000 characters long')

const postBlogIdInputValidator = body('blogId')
    .isString().withMessage('blogId is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('blogId is empty')
    .custom(validateBlogId).withMessage('invalid blogId!')

export const postBodyValidator = [
    postTitleInputValidator,
    postShortDescriptionInputValidator,
    postContentInputValidator,
    postBlogIdInputValidator
]

export const BlogPostBodyValidator = [
    postTitleInputValidator,
    postShortDescriptionInputValidator,
    postContentInputValidator
]