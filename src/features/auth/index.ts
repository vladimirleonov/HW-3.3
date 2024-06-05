import {Router} from "express"
import {loginController} from "./controllers/loginController"
import {loginBodyValidator} from "./validators/loginBodyValidator"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {authMeController} from "./controllers/authMeController"
import {bearerAuthMiddleware} from "../../common/middlewares/bearerAuthMiddleware"
import {registrationController} from "./controllers/registrationUserController";
import {registrationUserBodyValidator} from "./validators/registrationBodyValidator";
import {registrationConfirmationController} from "./controllers/registrationConfirmationController";

export const authRouter: Router = Router()

authRouter.post('/login', loginBodyValidator, inputCheckErrorsMiddleware, loginController)
authRouter.post('/registration', registrationUserBodyValidator, registrationController)
authRouter.post('/registration-confirmation', registrationUserBodyValidator, registrationConfirmationController)
authRouter.get('/me', bearerAuthMiddleware, authMeController)