import {Request, Response} from "express";
import {RegisterUserBodyInputType} from "../input-output-types/auth-types";
import {ErrorsMessagesType} from "../../../common/types/errorsMessages";
import {HTTP_CODES} from "../../../settings";
import {authService} from "../services/authService";

export const registrationUserController = async (req: Request<{}, {}, RegisterUserBodyInputType>, res: Response) => {
    try {
        const result = await authService.registrationUser(req.body)
    } catch (err) {
        console.error(err)
        res.send(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}