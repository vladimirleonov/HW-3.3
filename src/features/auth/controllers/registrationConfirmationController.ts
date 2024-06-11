import {Request, Response} from "express";
import {authService} from "../services/authService";
import {Result, ResultStatus} from "../../../common/types/result";
import {HTTP_CODES} from "../../../settings";
import {RegistrationConfirmationInputControllerType} from "../types/inputTypes/authInputControllersTypes";

export const registrationConfirmationController = async (req: Request<{}, {}, RegistrationConfirmationInputControllerType>, res: Response) => {
    try {
        const result: Result<Boolean | null> = await authService.confirmRegistration(req.body);
        if(result.status === ResultStatus.BadRequest) {
            res.status(HTTP_CODES.BAD_REQUEST).send({
                errorsMessages: result.extensions
            })
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}