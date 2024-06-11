import {body} from "express-validator"

const userLoginInputValidator = body('login')
    .isString().withMessage('login is missing or not a string')
    .trim()
    .isLength({min: 3}).withMessage('login is less than 3 characters long')
    .isLength({max: 10}).withMessage('login must be less than 10 characters long')
    .matches(/^[a-zA-Z0-9_-]*$/)

const userPasswordInputValidator = body('password')
    .isString().withMessage('password is missing or not a string')
    .trim()
    .isLength({min: 6}).withMessage('password is less than 6 characters long')
    .isLength({max: 20}).withMessage('password must be less than 20 characters long')

const userEmailInputValidator = body('email')
    .isString().withMessage('email is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('email is required')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)

export const registrationUserBodyValidator = [
    userLoginInputValidator,
    userPasswordInputValidator,
    userEmailInputValidator
]