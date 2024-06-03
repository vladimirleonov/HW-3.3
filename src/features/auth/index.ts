import {Router} from "express"
import {loginUserController} from "./controllers/loginUserController"
import {loginBodyValidator} from "./validators/loginBodyValidator"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {authMeUserController} from "./controllers/authMeUserController"
import {bearerAuthMiddleware} from "../../common/middlewares/bearerAuthMiddleware"

export const authRouter: Router = Router()

authRouter.post('/login', loginBodyValidator, inputCheckErrorsMiddleware, loginUserController)
authRouter.get('/me', bearerAuthMiddleware, authMeUserController)