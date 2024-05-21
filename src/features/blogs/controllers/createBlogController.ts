import {Request, Response} from 'express'
import {InputBlogType, OutputBlogType} from '../../../input-output-types/blog-types'
import {HTTP_CODES} from '../../../settings'
import {blogService} from "../services/blogService";
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";

export const createBlogController = async (req: Request<{}, OutputBlogType, InputBlogType>, res: Response<OutputBlogType>) => {
    try {
        const createdBlogId: string = await blogService.createBlog(req.body)

        const blog: OutputBlogType= await blogMongoQueryRepository.findForOutputById(createdBlogId)

        res.status(HTTP_CODES.CREATED).send(blog);
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}