import {body} from "express-validator"

const loginOrEmailInputValidator = body('loginOrEmail')
    .isString().withMessage('loginOrEmail is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('loginOrEmail is empty')

const PasswordInputValidator = body('password')
    .isString().withMessage('password is missing or not a string')
    .trim()
    .isLength({min: 6}).withMessage('password is less than 6 characters long')
    .isLength({max: 20}).withMessage('password must be less than 20 characters long')

export const loginBodyValidator = [
    loginOrEmailInputValidator,
    PasswordInputValidator
]