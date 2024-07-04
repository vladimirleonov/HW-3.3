import {Request, Response} from "express";
import {Result, ResultStatus} from "../../../common/types/result";
import {authService} from "../services/authService";
import {NewPasswordInputControllerType} from "../types/inputTypes/authInputControllersTypes";
import {HTTP_CODES} from "../../../settings";

export const newPasswordController = async (req: Request<{}, {}, NewPasswordInputControllerType>, res: Response) => {
    try {
        const result: Result = await authService.setNewPassword(req.body)
        if (result.status === ResultStatus.BadRequest) {
            res.status(HTTP_CODES.BAD_REQUEST).send()
            return
        }
        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}