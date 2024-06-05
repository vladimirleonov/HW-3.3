import {body} from "express-validator";

export const registrationConfirmationBodyValidator = body('code')
    .isString().withMessage('code is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('code is required')

