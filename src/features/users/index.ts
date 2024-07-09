import {Router} from "express"
import {queryUsersParamsValidator} from './validators/queryUsersParamsValidator'
import {basicAuthMiddleware} from "../../common/middlewares/basicAuthMiddleware"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {idParamValidator} from "../../common/validators/idParamValidator"
import {userInputValidator} from "./validators/userBodyValidator"
import {usersController} from "./controllers/usersController";

export const usersRouter: Router = Router()

usersRouter.get('/', queryUsersParamsValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, usersController.getUsers.bind(usersController))
usersRouter.post('/', userInputValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', idParamValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, usersController.deleteUser.bind(usersController))