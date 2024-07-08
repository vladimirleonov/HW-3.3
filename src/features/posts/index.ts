import {Router} from "express"
import {postBodyValidator} from "./validators/postBodyValidators"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {basicAuthMiddleware} from "../../common/middlewares/basicAuthMiddleware"
import {idParamValidator} from "../../common/validators/idParamValidator"
import {queryPostsParamsValidator} from "./validators/queryPostsParamsValidator"
import {commentBodyValidator} from "../comments/validators/commentBodyValidator"
import {authMiddleware} from "../../common/middlewares/authMiddleware"
import {queryPostCommentsParamsValidator} from "../comments/validators/queryPostCommentsParamsValidator"
import {postsController} from "./controllers/postsController";
import {commentController} from "../comments/controllers/commentController";

export const postsRouter = Router()

postsRouter.get('/', queryPostsParamsValidator, inputCheckErrorsMiddleware, postsController.getPosts)
postsRouter.get('/:id', idParamValidator, inputCheckErrorsMiddleware, postsController.getPost)
postsRouter.post('/', postBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, postsController.createPost)
postsRouter.get('/:postId/comments', queryPostCommentsParamsValidator, inputCheckErrorsMiddleware, commentController.getPostComments)
postsRouter.post('/:postId/comments', commentBodyValidator, authMiddleware, inputCheckErrorsMiddleware, commentController.createPostComment)
postsRouter.put('/:id', idParamValidator, postBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, postsController.updatePost)
postsRouter.delete('/:id', idParamValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, postsController.deletePost)