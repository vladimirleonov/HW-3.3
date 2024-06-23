import {Request, Response} from "express";
import {authService} from "../services/authService";
import {Result, ResultStatus} from "../../../common/types/result";
import {HTTP_CODES} from "../../../settings";
import {RegistrationEmailResendingInputServiceType} from "../types/inputTypes/authInputServiceTypes";

export const registrationEmailResendingController = async (req: Request<{}, {}, RegistrationEmailResendingInputServiceType>, res: Response) => {
    const result: Result = await authService.registrationEmailResending(req.body)
    console.log("registrationEmailResendingController", result)
    if (result.status === ResultStatus.BadRequest) {
        res.status(HTTP_CODES.BAD_REQUEST).send({
            errorsMessages: result.extensions
        })
        return
    }

    res.status(HTTP_CODES.NO_CONTENT).send()
}