import {Router} from "express";
import {getCommentController} from "./controllers/getCommentController";
import {bearerAuthMiddleware} from "../../common/middlewares/bearerAuthMiddleware";
import {deleteCommentController} from "./controllers/deleteCommentController";

export const commentsRouter = Router()

commentsRouter.get('/:id', getCommentController)
commentsRouter.delete('/:commentId', bearerAuthMiddleware, deleteCommentController)