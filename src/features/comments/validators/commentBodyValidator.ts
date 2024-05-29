import {body} from "express-validator";

export const commentBodyValidator = body('content')
    .isString().withMessage('content is missing or not a string')
    .trim()
    .isLength({min: 20}).withMessage('content must be more than 20 characters long')
    .isLength({max: 300}).withMessage('content must be less than 300 characters long')