import {Request, Response} from "express";
import {registrationEmailResendingUserBodyValidator} from "../validators/registrationEmailResendingUserBodyValidator";
import {authService} from "../services/authService";
import {registrationEmailResendingUserBodyInputType} from "../input-output-types/auth-types";

export const registrationEmailConfirmationController = (req: Request<{}, {}, registrationEmailResendingUserBodyInputType>, res: Response) => {
    const result = await authService.registrationEmailResending(req.body)
}