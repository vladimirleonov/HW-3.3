import {Request, Response} from 'express'
import {InputBlogType, OutputBlogType} from '../types/blog-types'
import {HTTP_CODES} from '../../../settings'
import {blogService} from "../services/blogService";
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";

export const createBlogController = async (req: Request<{}, OutputBlogType, InputBlogType>, res: Response<OutputBlogType>) => {
    try {
        const createdBlogId: string = await blogService.createBlog(req.body)

        const foundInfo= await blogMongoQueryRepository.findForOutputById(createdBlogId)

        res.status(HTTP_CODES.CREATED).send(foundInfo.blog);
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}