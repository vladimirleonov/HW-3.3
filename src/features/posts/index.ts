import {Router} from "express"
import {postBodyValidator} from "./validators/postBodyValidators"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {basicAuthMiddleware} from "../../common/middlewares/basicAuthMiddleware"
import {idParamValidator} from "../../common/validators/idParamValidator"
import {queryPostsParamsValidator} from "./validators/queryPostsParamsValidator"
import {commentBodyValidator} from "../comments/validators/commentBodyValidator"
import {authMiddleware} from "../../common/middlewares/authMiddleware"
import {getPostCommentsController} from "../comments/controllers/getPostCommentsController"
import {queryPostCommentsParamsValidator} from "../comments/validators/queryPostCommentsParamsValidator"
import {postsController} from "./controllers/postsController";
import {createPostCommentController} from "../comments/controllers/createCommentController";

export const postsRouter = Router()

postsRouter.get('/', queryPostsParamsValidator, inputCheckErrorsMiddleware, postsController.getPosts)
postsRouter.get('/:id', idParamValidator, inputCheckErrorsMiddleware, postsController.getPost)
postsRouter.get('/:postId/comments', queryPostCommentsParamsValidator, inputCheckErrorsMiddleware, getPostCommentsController)
postsRouter.post('/', postBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, postsController.createPost)
postsRouter.post('/:postId/comments', commentBodyValidator, authMiddleware, inputCheckErrorsMiddleware, createPostCommentController)
postsRouter.put('/:id', idParamValidator, postBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, postsController.updatePost)
postsRouter.delete('/:id', idParamValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, postsController.deletePost)