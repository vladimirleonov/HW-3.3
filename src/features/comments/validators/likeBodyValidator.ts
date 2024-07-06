import {body} from "express-validator"

export const likeBodyValidator = body('likeStatus')
    .isString().withMessage('likeStatus is missing or not a string')
    .trim()
    .isLength({min: 1}).withMessage('likeStatus is empty')
    .isIn(['Like', 'Dislike', 'None']).withMessage('likeStatus must be Like, Dislike or None')