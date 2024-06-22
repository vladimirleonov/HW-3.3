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

export const authRouter: Router = Router()

authRouter.post('/login', loginBodyValidator, inputCheckErrorsMiddleware, loginController)
authRouter.post('/registration', registrationUserBodyValidator, inputCheckErrorsMiddleware, registrationController)
authRouter.post('/registration-confirmation', registrationConfirmationBodyValidator, registrationConfirmationController)
authRouter.post('/registration-email-resending', registrationEmailResendingBodyValidator, registrationEmailResendingController)
authRouter.post('/refresh-token', refreshTokenController)
authRouter.post('/logout', logoutController)


authRouter.get('/me', authMiddleware, authMeController)