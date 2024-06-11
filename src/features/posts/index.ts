import {Router} from "express"
import {getPostsController} from "./controllers/getPostsController"
import {createPostController} from "./controllers/createPostController"
import {getPostController} from "./controllers/getPostController"
import {deletePostController} from "./controllers/deletePostController"
import {updatePostController} from "./controllers/updatePostController"
import {postBodyValidator} from "./validators/postBodyValidators"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {basicAuthMiddleware} from "../../common/middlewares/basicAuthMiddleware"
import {idParamValidator} from "../../common/validators/idParamValidator"
import {queryPostsParamsValidator} from "./validators/queryPostsParamsValidator"
import {commentBodyValidator} from "../comments/validators/commentBodyValidator"
import {bearerAuthMiddleware} from "../../common/middlewares/bearerAuthMiddleware"
import {createCommentController} from "../comments/controllers/createCommentController"
import {getPostCommentsController} from "../comments/controllers/getPostCommentsController"
import {queryPostCommentsParamsValidator} from "../comments/validators/queryPostCommentsParamsValidator"

export const postsRouter = Router()

postsRouter.get('/', queryPostsParamsValidator, inputCheckErrorsMiddleware, getPostsController)
postsRouter.get('/:postId/comments', queryPostCommentsParamsValidator, inputCheckErrorsMiddleware, getPostCommentsController)
postsRouter.post('/', postBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, createPostController)
postsRouter.post('/:postId/comments', commentBodyValidator, bearerAuthMiddleware, inputCheckErrorsMiddleware, createCommentController)
postsRouter.get('/:id', idParamValidator, inputCheckErrorsMiddleware, getPostController)
postsRouter.put('/:id', idParamValidator, postBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, updatePostController)
postsRouter.delete('/:id', idParamValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, deletePostController)