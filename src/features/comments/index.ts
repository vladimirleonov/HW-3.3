import {Router} from "express"
import {getCommentController} from "./controllers/getCommentController"
import {bearerAuthMiddleware} from "../../common/middlewares/bearerAuthMiddleware"
import {deleteCommentController} from "./controllers/deleteCommentController"
import {updateCommentController} from "./controllers/updateCommentController"
import {commentBodyValidator} from "./validators/commentBodyValidator"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"

export const commentsRouter = Router()

commentsRouter.get('/:id', getCommentController)
commentsRouter.put('/:commentId', bearerAuthMiddleware, commentBodyValidator, inputCheckErrorsMiddleware, updateCommentController)
commentsRouter.delete('/:commentId', bearerAuthMiddleware, deleteCommentController)