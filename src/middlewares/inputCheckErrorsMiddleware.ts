import {NextFunction, Request, Response} from "express"
import {Result, validationResult, ValidationError} from "express-validator"
import {HTTP_CODES} from "../settings"

interface ValidationErrorMessage {
    path: string
    msg: string
}

export const inputCheckErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result: Result<ValidationError> = validationResult(req)

    if (!result.isEmpty()) {
        const errors: ValidationErrorMessage[] = result.array({onlyFirstError: true}) as ValidationErrorMessage[]

        res.status(HTTP_CODES.BAD_REQUEST).send({
            errorsMessages: errors.map(error => ({
                message: error.msg,
                field: error.path
            }))
        })
        return
    }
    next()
}