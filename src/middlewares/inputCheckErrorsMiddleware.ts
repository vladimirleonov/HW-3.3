import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {HTTP_CODES} from "../settings";

export const inputCheckErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
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