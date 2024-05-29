import {Router} from "express";
import {getCommentController} from "./controllers/getCommentController";

export const commentsRouter = Router()

commentsRouter.get('/:id', getCommentController)