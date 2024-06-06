import {Request, Response} from "express";
import {RegisterUserBodyInputType} from "../input-output-types/auth-types";
import {HTTP_CODES} from "../../../settings";
import {authService} from "../services/authService";
import {Result, ResultStatus} from "../../../common/types/result-type";

export const registrationController = async (req: Request<{}, {}, RegisterUserBodyInputType>, res: Response) => {
    try {
        const result: Result<boolean | null> = await authService.registrationUser(req.body)
        if (result.status === ResultStatus.BadRequest) {
            res.status(HTTP_CODES.BAD_REQUEST).send({
                errorsMessages: result.extensions
            })
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send({})
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}