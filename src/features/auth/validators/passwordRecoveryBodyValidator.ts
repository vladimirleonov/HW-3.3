import {body} from "express-validator";

export const passwordRecoveryBodyValidator = body('email')
    .isString().withMessage('email is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('email is required')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
