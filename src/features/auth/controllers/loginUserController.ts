import {Request, Response} from "express";
import {HTTP_CODES} from "../../../settings";
import {LoginInputType} from "../input-output-types/auth-types";
import {authService} from "../services/authService";
import {ErrorsMessagesType} from "../../../common/helpers/generateErrorMessages";

export const loginUserController = async (req: Request<{}, ErrorsMessagesType, LoginInputType>, res: Response) => {
    try {
        const result = await authService.login(req.body)
        if (result.error) {
            res.status(HTTP_CODES.UNAUTHORIZED).send(result.error)
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}