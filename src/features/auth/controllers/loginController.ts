import {Request, Response} from "express"
import {HTTP_CODES} from "../../../settings"
import {LoginInputType, LoginOutputType} from "../input-output-types/auth-types"
import {authService} from "../services/authService"
import {Result, ResultStatus} from "../../../common/types/result"
import {ErrorsMessagesType} from "../../../common/types/errorMessageType"

//? response error
export const loginController = async (req: Request<{}, LoginOutputType, LoginInputType>, res: Response<LoginOutputType | ErrorsMessagesType>) => {
    try {
        const result: Result<string | null> = await authService.login(req.body)
        if (result.status === ResultStatus.BadRequest) {
            res.status(HTTP_CODES.UNAUTHORIZED).send({
                errorsMessages: result.extensions || [],
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