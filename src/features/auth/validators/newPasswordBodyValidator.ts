import {body} from "express-validator";

const passwordInputValidator = body('newPassword')
    .isString().withMessage('password is missing or not a string')
    .trim()
    .isLength({min: 6}).withMessage('password is less than 6 characters long')
    .isLength({max: 20}).withMessage('password must be less than 20 characters long')

const recoveryCodeInputValidator = body('recoveryCode')
    .isString().withMessage('code is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('code is required')


export const newPasswordBodyValidator = [
    passwordInputValidator,
    recoveryCodeInputValidator
]