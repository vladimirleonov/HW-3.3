import {body} from "express-validator"

// body validator

const loginOrEmailInputValidator = body('loginOrEmail')
    .isString().withMessage('loginOrEmail is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('loginOrEmail is empty')

const PasswordInputValidator = body('password')
    .isString().withMessage('password is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('password is required')

export const loginBodyValidator = [
    loginOrEmailInputValidator,
    PasswordInputValidator
]