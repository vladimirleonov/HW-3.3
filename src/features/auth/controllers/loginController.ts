import {Request, Response} from "express"
import {HTTP_CODES} from "../../../settings"
import {authService} from "../services/authService"
import {Result, ResultStatus} from "../../../common/types/result"
import {ErrorsMessagesType} from "../../../common/types/errorMessageType"
import {LoginOutputControllerType} from "../types/outputTypes/authOutputControllersTypes";
import {LoginInputControllerType} from "../types/inputTypes/authInputControllersTypes";
import {LoginOutputServiceType} from "../types/outputTypes/authOutputServiceTypes";
import {getIpAddress} from "../../../common/helpers/getIpAddress";
import {getDeviceName} from "../../../common/helpers/getDeviceName";

export const loginController = async (req: Request<{}, LoginOutputControllerType, LoginInputControllerType>, res: Response<LoginOutputControllerType | ErrorsMessagesType>) => {
    try {
        let ip: string = getIpAddress(req)
        let deviceName: string = getDeviceName(req)

        const refreshToken = req.cookies?.refreshToken

        const result: Result<LoginOutputServiceType | null> = await authService.login({
            ...req.body,
            ip,
            deviceName,
            refreshToken
        })
        if (result.status === ResultStatus.BadRequest) {
            res.status(HTTP_CODES.UNAUTHORIZED).send({
                errorsMessages: result.extensions || [],
            })
            return
        }

        res.cookie('refreshToken', result.data?.refreshToken, {
            httpOnly: true, // cookie can only be accessed via http or https
            secure: true,
            //secure: process.env.NODE_ENV === 'production', // send cookie only over https
            sameSite: 'strict' // protects against CSRF attacks
        })

        res.status(HTTP_CODES.OK).send({
            accessToken: result.data?.accessToken!
        })
    } catch (err) {
        console.error('loginController', err);
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}