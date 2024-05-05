import {Request, Response, NextFunction} from "express";
import {ValidationError, validationResult} from "express-validator";
import {HTTP_CODES} from "../settings";

export const inputCheckErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        // const errors = result.formatWith((error: ValidationError) => ({
        //     field: error.path
        //     message: error.msg,         
        // })).array({onlyFirstError: true});

        // res.status(HTTP_CODES.BAD_REQUEST).send({errorsMessages: errors})
        // return

        const errors = result.array({onlyFirstError: true}) as { path: string, msg: string }[]

        res.status(HTTP_CODES.BAD_REQUEST).send({
            errorsMessages: errors.map(error => ({
                message: error.msg,
                field: error.path
            }))
        })
        return
    }

    next()
};