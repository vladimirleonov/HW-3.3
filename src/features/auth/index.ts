import {Router} from "express";
import {loginUserController} from "./controllers/loginUserController";
import {loginBodyValidator} from "./validators/loginBodyValidator";
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware";

export const authRouter: Router = Router()

authRouter.post('/login', loginBodyValidator, inputCheckErrorsMiddleware, loginUserController)