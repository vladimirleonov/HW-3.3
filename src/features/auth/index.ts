import {Router} from "express"
import {loginBodyValidator} from "./validators/loginBodyValidator"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {authMiddleware} from "../../common/middlewares/authMiddleware"
import {registrationUserBodyValidator} from "./validators/registrationBodyValidator"
import {registrationConfirmationBodyValidator} from "./validators/registrationConfirmationBodyValidator"
import {registrationEmailResendingBodyValidator} from "./validators/registrationEmailResendingBodyValidator"
import {refreshTokenAuthMiddleware} from "../../common/middlewares/refreshTokenAuthMiddleware"
import {rateLimitMiddleware} from "../../common/middlewares/rateLimitMiddleware"
import {passwordRecoveryBodyValidator} from "./validators/passwordRecoveryBodyValidator"
import {newPasswordBodyValidator} from "./validators/newPasswordBodyValidator"
import {authController} from "./controllers/authController"

export const authRouter: Router = Router()

authRouter.post('/registration', rateLimitMiddleware, registrationUserBodyValidator, inputCheckErrorsMiddleware, authController.registration)
authRouter.post('/registration-confirmation', rateLimitMiddleware, registrationConfirmationBodyValidator, authController.registrationConfirmation)
authRouter.post('/registration-email-resending', rateLimitMiddleware, registrationEmailResendingBodyValidator, inputCheckErrorsMiddleware, authController.registrationEmailResending)
authRouter.post('/password-recovery', rateLimitMiddleware, passwordRecoveryBodyValidator, inputCheckErrorsMiddleware, authController.registrationPasswordRecovery)
authRouter.post('/new-password', rateLimitMiddleware, newPasswordBodyValidator, inputCheckErrorsMiddleware, authController.setNewPassword)
authRouter.post('/login', rateLimitMiddleware, loginBodyValidator, inputCheckErrorsMiddleware, authController.login)
authRouter.post('/refresh-token', refreshTokenAuthMiddleware, authController.refreshToken)
authRouter.get('/me', authMiddleware, authController.authMe)
authRouter.post('/logout', refreshTokenAuthMiddleware, authController.logout)