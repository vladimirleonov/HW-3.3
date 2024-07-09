import {Request, Response} from "express";
import {
    LoginInputControllerType,
    NewPasswordInputControllerType,
    RegistrationConfirmationInputControllerType, RegistrationEmailResendingInputControllerType,
    RegistrationInputControllerType, RegistrationPasswordRecoveryInputControllerType
} from "../types/inputTypes/authInputControllersTypes";
import {Result, ResultStatus} from "../../../common/types/result";
import {authService} from "../services/authService";
import {HTTP_CODES} from "../../../settings";
import {
    AuthMeUserOutputControllerType,
    LoginOutputControllerType,
    RefreshTokenOutputControllerType
} from "../types/outputTypes/authOutputControllersTypes";
import {ErrorsMessagesType} from "../../../common/types/errorMessageType";
import {getIpAddress} from "../../../common/helpers/getIpAddress";
import {getDeviceName} from "../../../common/helpers/getDeviceName";
import {LoginOutputServiceType, RefreshTokenOutputServiceType} from "../types/outputTypes/authOutputServiceTypes";
import {AuthenticatedUserOutputType} from "../../users/input-output-types/user-types";
import {UserMongoQueryRepository} from "../../users/repository/userMongoQueryRepository";

class AuthController {
    userMongoQueryRepository: UserMongoQueryRepository
    constructor() {
        this.userMongoQueryRepository = new UserMongoQueryRepository()
    }
    async registration (req: Request<{}, {}, RegistrationInputControllerType>, res: Response) {
        try {
            const result: Result = await authService.registration(req.body)
            if (result.status === ResultStatus.BadRequest) {
                res.status(HTTP_CODES.BAD_REQUEST).send({
                    errorsMessages: result.extensions
                })
                return
            }

            res.status(HTTP_CODES.NO_CONTENT).send();
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async registrationConfirmation (req: Request<{}, {}, RegistrationConfirmationInputControllerType>, res: Response) {
        try {
            const result: Result<Boolean | null> = await authService.confirmRegistration(req.body);
            if (result.status === ResultStatus.BadRequest) {
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
    async registrationEmailResending (req: Request<{}, {}, RegistrationEmailResendingInputControllerType>, res: Response) {
        const result: Result = await authService.registrationEmailResending(req.body)

        if (result.status === ResultStatus.BadRequest) {
            res.status(HTTP_CODES.BAD_REQUEST).send({
                errorsMessages: result.extensions
            })
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    }
    async registrationPasswordRecovery (req: Request<{}, {}, RegistrationPasswordRecoveryInputControllerType>, res: Response) {
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
    async setNewPassword (req: Request<{}, {}, NewPasswordInputControllerType>, res: Response) {
        try {
            const result: Result = await authService.setNewPassword(req.body)
            if (result.status === ResultStatus.BadRequest) {
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
    async login (req: Request<{}, LoginOutputControllerType, LoginInputControllerType>, res: Response<LoginOutputControllerType | ErrorsMessagesType>) {
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
    async refreshToken (req: Request<{}, {}, RefreshTokenOutputControllerType>, res: Response<RefreshTokenOutputControllerType | string>) {
        try {
            const deviceId: string | undefined = req.device?.deviceId
            const userId: string | undefined = req.device?.userId
            const iat: string | undefined = req.device?.iat

            if (!deviceId || !userId || !iat) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const result: Result<RefreshTokenOutputServiceType | null> = await authService.refreshToken({
                deviceId,
                userId,
                iat
            })
            if (result.status === ResultStatus.Unauthorized) {
                console.error("Invalid or expired refresh token", result.extensions)
                res.status(HTTP_CODES.UNAUTHORIZED).send("Invalid or expired refresh token")
                return
            }

            res.cookie('refreshToken', result.data?.refreshToken, {
                httpOnly: true,
                secure: true,
                // secure: SETTINGS.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            res.status(HTTP_CODES.OK).send({
                accessToken: result.data?.accessToken!,
            });
        } catch (err) {
            console.error('refreshTokenController', err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async authMe (req: Request<{}, {}, AuthMeUserOutputControllerType, {}>, res: Response<AuthMeUserOutputControllerType>) {
        try {
            if (!req.user || !req.user.userId) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const user: AuthenticatedUserOutputType | null = await this.userMongoQueryRepository.findAuthenticatedUserById(req.user.userId)
            if (!user) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            res.status(HTTP_CODES.OK).send(user)
        } catch (err) {
            console.error('authMeController', err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async logout (req: Request, res: Response) {
        try {
            const deviceId: string | undefined = req.device?.deviceId
            const iat: string | undefined = req.device?.iat
            if (!deviceId || !iat) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const result: Result = await authService.logout({deviceId, iat})
            if (result.status === ResultStatus.Unauthorized) {
                console.error("Invalid or expired refresh token", result.extensions)
                res.status(HTTP_CODES.UNAUTHORIZED).send("Invalid or expired refresh token")
                return
            }

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                //secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            res.status(HTTP_CODES.NO_CONTENT).send()
        } catch (err) {
            console.error('logoutController', err)
            res.status(HTTP_CODES.UNAUTHORIZED).send()
        }
    }
}

export const authController: AuthController = new AuthController()