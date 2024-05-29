import {Request, Response} from "express";
import {HTTP_CODES} from "../../../settings";
import {LoginInputType, LoginOutputType} from "../input-output-types/auth-types";
import {authService} from "../services/authService";
import {Result} from "../../../common/types/result-type";
import {ErrorsMessagesType} from "../../../common/types/errorsMessages";

export const loginUserController = async (req: Request<{}, LoginOutputType|ErrorsMessagesType, LoginInputType>, res: Response<LoginOutputType|ErrorsMessagesType>) => {
    try {
        const result: Result<string | null> = await authService.login(req.body)
        if (result.extensions && result.extensions.length > 0) {
            res.status(HTTP_CODES.BAD_REQUEST).send({
                errorsMessages: [
                    result.extensions[0],
                ]
            })
            return
        }

        res.status(HTTP_CODES.OK).send({
            //?
            accessToken: result.data!
        })
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}