import {Request, Response} from "express";
import {
    RegistrationPasswordRecoveryInputControllerType
} from "../types/inputTypes/authInputControllersTypes";
import {authService} from "../services/authService";
import {Result} from "../../../common/types/result";
import {HTTP_CODES} from "../../../settings";

export const registrationPasswordRecoveryController = async (req: Request<{}, {}, RegistrationPasswordRecoveryInputControllerType>, res: Response) => {
    try {
        const result: Result = await authService.registrationPasswordRecovery(req.body)

        // for prevent user's email detection send NO_CONTENT
        // for user by email not found or email send successfully
        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error('Error in registrationPasswordRecoveryController', err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}