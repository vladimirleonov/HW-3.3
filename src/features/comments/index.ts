import {Router} from "express"
import {getCommentController} from "./controllers/getCommentController"
import {authMiddleware} from "../../common/middlewares/authMiddleware"
import {deleteCommentController} from "./controllers/deleteCommentController"
import {updateCommentController} from "./controllers/updateCommentController"
import {commentBodyValidator} from "./validators/commentBodyValidator"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"

export const commentsRouter = Router()

commentsRouter.get('/:id', getCommentController)
commentsRouter.put('/:commentId', authMiddleware, commentBodyValidator, inputCheckErrorsMiddleware, updateCommentController)
commentsRouter.delete('/:commentId', authMiddleware, deleteCommentController)