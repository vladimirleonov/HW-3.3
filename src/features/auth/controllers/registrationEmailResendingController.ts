import {Request, Response} from "express";
import {authService} from "../services/authService";
import {registrationEmailResendingUserBodyInputType} from "../input-output-types/auth-types";
import {Result, ResultStatus} from "../../../common/types/result-type";
import {HTTP_CODES} from "../../../settings";

export const registrationEmailResendingController = async (req: Request<{}, {}, registrationEmailResendingUserBodyInputType>, res: Response) => {
    const result: Result = await authService.registrationEmailResending(req.body)
    if (result.status === ResultStatus.BadRequest) {
        res.status(HTTP_CODES.BAD_REQUEST).send({
            errorsMessages: result.extensions
        })
        return
    }

    res.status(HTTP_CODES.NO_CONTENT).send({})
}