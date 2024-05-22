import {Router} from "express"
import {getBlogsController} from "./controllers/getBlogsController"
import {createBlogController} from "./controllers/createBlogController"
import {findBlogController} from "./controllers/findBlogController"
import {updateBlogController} from "./controllers/updateBlogController"
import {deleteBlogController} from "./controllers/deleteBlogController"
import {blogInputValidator} from "./validators/blogBodyValidators"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {authMiddleware} from "../../common/middlewares/authMiddleware"
import {queryBlogPostsParamsValidator} from "./validators/queryBlogPostsParamsValidator";
import {queryBlogsParamsValidator} from "./validators/queryBlogsParamsValidator"
import {idParamValidator} from "../../common/validators/idParamValidator";
import {getBlogPostsController} from "./controllers/getBlogPostsController";
import {createBlogPostController} from "./controllers/createBlogPostController";
import {
    BlogPostInputValidator,
} from "../posts/validators/postBodyValidators";
import {blogIdParamValidator} from "./validators/blogIdParamValidator";

export const blogsRouter = Router()

blogsRouter.get('/', queryBlogsParamsValidator, inputCheckErrorsMiddleware, getBlogsController)
blogsRouter.post('/', blogInputValidator, authMiddleware, inputCheckErrorsMiddleware, createBlogController)
blogsRouter.get('/:blogId/posts', blogIdParamValidator, queryBlogPostsParamsValidator, inputCheckErrorsMiddleware, getBlogPostsController)
blogsRouter.post('/:blogId/posts', blogIdParamValidator, BlogPostInputValidator, authMiddleware, inputCheckErrorsMiddleware, createBlogPostController)
blogsRouter.get('/:id', idParamValidator, inputCheckErrorsMiddleware, findBlogController)
blogsRouter.put('/:id', idParamValidator, blogInputValidator, authMiddleware, inputCheckErrorsMiddleware, updateBlogController)
blogsRouter.delete('/:id', idParamValidator, authMiddleware, inputCheckErrorsMiddleware, deleteBlogController)