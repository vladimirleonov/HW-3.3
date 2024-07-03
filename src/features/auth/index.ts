import {Router} from "express"
import {loginController} from "./controllers/loginController"
import {loginBodyValidator} from "./validators/loginBodyValidator"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {authMeController} from "./controllers/authMeController"
import {authMiddleware} from "../../common/middlewares/authMiddleware"
import {registrationController} from "./controllers/registrationController";
import {registrationUserBodyValidator} from "./validators/registrationBodyValidator";
import {registrationConfirmationController} from "./controllers/registrationConfirmationController";
import {registrationConfirmationBodyValidator} from "./validators/registrationConfirmationBodyValidator";
import {registrationEmailResendingBodyValidator} from "./validators/registrationEmailResendingBodyValidator";
import {
    registrationEmailResendingController
} from "./controllers/registrationEmailResendingController";
import {refreshTokenController} from "./controllers/refreshTokenController";
import {logoutController} from "./controllers/logoutController";
import {refreshTokenAuthMiddleware} from "../../common/middlewares/refreshTokenAuthMiddleware";
import {rateLimitMiddleware} from "../../common/middlewares/rateLimitMiddleware";
import {passwordRecoveryBodyValidator} from "./validators/passwordRecoveryBodyValidator";
import {registrationPasswordRecoveryController} from "./controllers/registrationPasswordRecoveryController";

export const authRouter: Router = Router()

authRouter.post('/login', rateLimitMiddleware, loginBodyValidator, inputCheckErrorsMiddleware, loginController)
authRouter.post('/password-recovery', rateLimitMiddleware, passwordRecoveryBodyValidator, inputCheckErrorsMiddleware, registrationPasswordRecoveryController)
authRouter.post('/registration', rateLimitMiddleware, registrationUserBodyValidator, inputCheckErrorsMiddleware, registrationController)
authRouter.post('/registration-confirmation', rateLimitMiddleware, registrationConfirmationBodyValidator, registrationConfirmationController)
authRouter.post('/registration-email-resending', rateLimitMiddleware, registrationEmailResendingBodyValidator, inputCheckErrorsMiddleware, registrationEmailResendingController)
authRouter.post('/refresh-token', refreshTokenAuthMiddleware, refreshTokenController)
authRouter.post('/logout', refreshTokenAuthMiddleware, logoutController)


authRouter.get('/me', authMiddleware, authMeController)