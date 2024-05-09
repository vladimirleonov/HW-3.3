import {Router} from "express"
import {getBlogsController} from "./controllers/getBlogsController"
import {createBlogController} from "./controllers/createBlogController"
import {findBlogController} from "./controllers/findBlogController"
import {updateBlogController} from "./controllers/updateBlogController"
import {deleteBlogController} from "./controllers/deleteBlogController"
import {blogInputValidator} from "./validators/blogValidators";
import {inputCheckErrorsMiddleware} from "../../middlewares/inputCheckErrorsMiddleware";
import {authMiddleware} from "../../middlewares/authMiddleware";

export const blogsRouter = Router()

blogsRouter.get('/', getBlogsController)
blogsRouter.post('/', authMiddleware, blogInputValidator, inputCheckErrorsMiddleware, createBlogController)
blogsRouter.get('/:id', findBlogController)
blogsRouter.put('/:id', authMiddleware, blogInputValidator, inputCheckErrorsMiddleware, updateBlogController)
blogsRouter.delete('/:id', authMiddleware, deleteBlogController)
