import {Router} from "express"
import {createUserController} from './controllers/createUserController'
import {getUsersController} from './controllers/getUsersController'
import {deleteUserController} from './controllers/deleteUserController'
import {queryUsersParamsValidator} from './validators/queryUsersParamsValidator'
import {basicMiddleware} from "../../common/middlewares/basicMiddleware"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {idParamValidator} from "../../common/validators/idParamValidator"
import {userInputValidator} from "./validators/userBodyValidator"

export const usersRouter: Router = Router()

usersRouter.get('/', queryUsersParamsValidator, basicMiddleware, inputCheckErrorsMiddleware, getUsersController)
usersRouter.post('/', userInputValidator, basicMiddleware, inputCheckErrorsMiddleware, createUserController)
usersRouter.delete('/:id', idParamValidator, basicMiddleware, inputCheckErrorsMiddleware, deleteUserController)