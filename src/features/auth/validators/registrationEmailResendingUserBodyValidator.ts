import {body} from "express-validator";

export const registrationEmailResendingUserBodyValidator = body('email')
    .isString().withMessage('email is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('email is required')
