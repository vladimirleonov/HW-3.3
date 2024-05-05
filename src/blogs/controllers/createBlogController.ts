import {Request, Response} from 'express'
import {InputBlogType, OutputBlogType} from '../../input-output-types/blog-types'
import {blogRepository} from '../repository/blogRepository'
import {HTTP_CODES} from '../../settings';


export const createBlogController = async (req: Request<{}, OutputBlogType, InputBlogType>, res: Response<OutputBlogType>) => {
    const createdInfo = await blogRepository.create(req.body);

    if (!createdInfo.id) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        return
    }

    const foundInfo = await blogRepository.findById(createdInfo.id)
    if (!foundInfo.blog) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        return
    }

    res.status(HTTP_CODES.CREATED).send(foundInfo.blog);
}