import {Router} from "express"
import {loginUserController} from "./controllers/loginUserController"
import {loginBodyValidator} from "./validators/loginBodyValidator"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {authMeUserController} from "./controllers/authMeUserController"
import {bearerAuthMiddleware} from "../../common/middlewares/bearerAuthMiddleware"
import {registrationUserController} from "./controllers/registrationUserController";
import {registrationUserBodyValidator} from "./validators/registrationBodyValidator";

export const authRouter: Router = Router()

authRouter.post('/login', loginBodyValidator, inputCheckErrorsMiddleware, loginUserController)
authRouter.post('/registration', registrationUserBodyValidator, registrationUserController)
authRouter.get('/me', bearerAuthMiddleware, authMeUserController)