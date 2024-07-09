import {Router} from "express"
import {inputCheckErrorsMiddleware} from "../../common/middlewares/inputCheckErrorsMiddleware"
import {basicAuthMiddleware} from "../../common/middlewares/basicAuthMiddleware"
import {queryBlogPostsParamsValidator} from "./validators/queryBlogPostsParamsValidator"
import {queryBlogsParamsValidator} from "./validators/queryBlogsParamsValidator"
import {idParamValidator} from "../../common/validators/idParamValidator"
import {
    BlogPostBodyValidator,
} from "../posts/validators/postBodyValidators"
import {blogIdParamValidator} from "./validators/blogIdParamValidator"
import {blogBodyValidator} from "./validators/blogBodyValidators"
import {blogsController} from "./controllers/blogsController";

export const blogsRouter: Router = Router()

blogsRouter.get('/', queryBlogsParamsValidator, inputCheckErrorsMiddleware, blogsController.getBlogs.bind(blogsController))
blogsRouter.get('/:id', idParamValidator, inputCheckErrorsMiddleware, blogsController.getBlog.bind(blogsController))
blogsRouter.get('/:blogId/posts', blogIdParamValidator, queryBlogPostsParamsValidator, inputCheckErrorsMiddleware, blogsController.getBlogPosts.bind(blogsController))
blogsRouter.post('/', blogBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, blogsController.createBlog.bind(blogsController))
blogsRouter.post('/:blogId/posts', blogIdParamValidator, BlogPostBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, blogsController.createPostForBlog.bind(blogsController))
blogsRouter.put('/:id', idParamValidator, blogBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:id', idParamValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, blogsController.deleteBlog.bind(blogsController))


// blogsRouter.get('/', queryBlogsParamsValidator, inputCheckErrorsMiddleware, getBlogsController)
// blogsRouter.post('/', blogBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, createBlogController)
// blogsRouter.get('/:blogId/posts', blogIdParamValidator, queryBlogPostsParamsValidator, inputCheckErrorsMiddleware, getBlogPostsController)
// blogsRouter.post('/:blogId/posts', blogIdParamValidator, BlogPostBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, createBlogPostController)
// blogsRouter.get('/:id', idParamValidator, inputCheckErrorsMiddleware, getBlogController)
// blogsRouter.put('/:id', idParamValidator, blogBodyValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, updateBlogController)
// blogsRouter.delete('/:id', idParamValidator, basicAuthMiddleware, inputCheckErrorsMiddleware, deleteBlogController)