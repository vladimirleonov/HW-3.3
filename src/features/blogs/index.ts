import {Router} from "express"
import {getBlogsController} from "./controllers/getBlogsController"
import {createBlogController} from "./controllers/createBlogController"
import {getBlogController} from "./controllers/getBlogController"
import {updateBlogController} from "./controllers/updateBlogController"
import {deleteBlogController} from "./controllers/deleteBlogController"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {basicAuthMiddleware} from "../../common/middlewares/basicAuthMiddleware"
import {queryBlogPostsParamsValidator} from "./validators/queryBlogPostsParamsValidator"
import {queryBlogsParamsValidator} from "./validators/queryBlogsParamsValidator"
import {idParamValidator} from "../../common/validators/idParamValidator"
import {getBlogPostsController} from "./controllers/getBlogPostsController"
import {createBlogPostController} from "./controllers/createBlogPostController"
import {
    BlogPostBodyValidator,
} from "../posts/validators/postBodyValidators"
import {blogIdParamValidator} from "./validators/blogIdParamValidator"
import {blogBodyValidator} from "./validators/blogBodyValidators"

export const blogsRouter: Router = Router()

blogsRouter.get('/', queryBlogsParamsValidator, inputCheckErrorsMiddleware, getBlogsController)
blogsRouter.post('/', blogBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, createBlogController)
blogsRouter.get('/:blogId/posts', blogIdParamValidator, queryBlogPostsParamsValidator, inputCheckErrorsMiddleware, getBlogPostsController)
blogsRouter.post('/:blogId/posts', blogIdParamValidator, BlogPostBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, createBlogPostController)
blogsRouter.get('/:id', idParamValidator, inputCheckErrorsMiddleware, getBlogController)
blogsRouter.put('/:id', idParamValidator, blogBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, updateBlogController)
blogsRouter.delete('/:id', idParamValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, deleteBlogController)