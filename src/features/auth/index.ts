import {Router} from "express"
import {loginController} from "./controllers/loginController"
import {loginBodyValidator} from "./validators/loginBodyValidator"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {authMeController} from "./controllers/authMeController"
import {bearerAuthMiddleware} from "../../common/middlewares/bearerAuthMiddleware"
import {registrationController} from "./controllers/registrationController";
import {registrationUserBodyValidator} from "./validators/registrationBodyValidator";
import {registrationConfirmationController} from "./controllers/registrationConfirmationController";
import {registrationConfirmationBodyValidator} from "./validators/registrationConfirmationBodyValidator";
import {registrationEmailResendingUserBodyValidator} from "./validators/registrationEmailResendingUserBodyValidator";
import {
    registrationEmailResendingController
} from "./controllers/registrationEmailResendingController";

export const authRouter: Router = Router()

authRouter.post('/login', loginBodyValidator, inputCheckErrorsMiddleware, loginController)
authRouter.post('/registration', registrationUserBodyValidator, inputCheckErrorsMiddleware, registrationController)
authRouter.post('/registration-confirmation', registrationConfirmationBodyValidator, registrationConfirmationController)
authRouter.post('/registration-email-resending', registrationEmailResendingUserBodyValidator, registrationEmailResendingController)

authRouter.get('/me', bearerAuthMiddleware, authMeController)