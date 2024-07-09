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

authRouter.post('/registration', rateLimitMiddleware, registrationUserBodyValidator, inputCheckErrorsMiddleware, authController.registration.bind(authController))
authRouter.post('/registration-confirmation', rateLimitMiddleware, registrationConfirmationBodyValidator, authController.registrationConfirmation.bind(authController))
authRouter.post('/registration-email-resending', rateLimitMiddleware, registrationEmailResendingBodyValidator, inputCheckErrorsMiddleware, authController.registrationEmailResending.bind(authController))
authRouter.post('/password-recovery', rateLimitMiddleware, passwordRecoveryBodyValidator, inputCheckErrorsMiddleware, authController.registrationPasswordRecovery.bind(authController))
authRouter.post('/new-password', rateLimitMiddleware, newPasswordBodyValidator, inputCheckErrorsMiddleware, authController.setNewPassword.bind(authController))
authRouter.post('/login', rateLimitMiddleware, loginBodyValidator, inputCheckErrorsMiddleware, authController.login.bind(authController))
authRouter.post('/refresh-token', refreshTokenAuthMiddleware, authController.refreshToken.bind(authController))
authRouter.get('/me', authMiddleware, authController.authMe.bind(authController))
authRouter.post('/logout', refreshTokenAuthMiddleware, authController.logout.bind(authController))