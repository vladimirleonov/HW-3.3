import {Router} from "express"
import {getCommentController} from "./controllers/getCommentController"
import {authMiddleware} from "../../common/middlewares/authMiddleware"
import {deleteCommentController} from "./controllers/deleteCommentController"
import {updateCommentController} from "./controllers/updateCommentController"
import {commentBodyValidator} from "./validators/commentBodyValidator"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {commentIdParamValidator} from "./validators/commentIdParamValidator";
import {likeBodyValidator} from "./validators/likeBodyValidator";
import {updateLikeStatusController} from "./controllers/updateLikeStatusController";

export const commentsRouter = Router()

commentsRouter.get('/:id', getCommentController)
commentsRouter.put('/:commentId', authMiddleware, commentBodyValidator, inputCheckErrorsMiddleware, updateCommentController)
commentsRouter.put('/:commentId/like-status', authMiddleware, commentIdParamValidator, likeBodyValidator, inputCheckErrorsMiddleware, updateLikeStatusController)
commentsRouter.delete('/:commentId', authMiddleware, deleteCommentController)