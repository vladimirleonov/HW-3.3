import {Router} from "express"
import {authMiddleware} from "../../common/middlewares/authMiddleware"
import {commentBodyValidator} from "./validators/commentBodyValidator"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {commentIdParamValidator} from "./validators/commentIdParamValidator";
import {likeBodyValidator} from "./validators/likeBodyValidator";
import {commentController} from "./controllers/commentController";

export const commentsRouter = Router()

commentsRouter.get('/:id', commentController.getComment)
commentsRouter.put('/:commentId', authMiddleware, commentBodyValidator, inputCheckErrorsMiddleware, commentController.updateComment)
commentsRouter.put('/:commentId/like-status', authMiddleware, commentIdParamValidator, likeBodyValidator, inputCheckErrorsMiddleware, commentController.updateLikeStatus)
commentsRouter.delete('/:commentId', authMiddleware, commentController.deleteComment)