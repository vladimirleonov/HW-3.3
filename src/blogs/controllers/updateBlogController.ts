import {Request, Response} from 'express'
import {blogRepository} from '../repository/blogRepository'
import {InputIdType, OutputBlogType, InputBlogType} from '../../input-output-types/blog-types';
import {HTTP_CODES} from '../../settings';

export const updateBlogController = async (req: Request<InputIdType, OutputBlogType, InputBlogType>, res: Response<OutputBlogType>) => {
    const updatedInfo = await blogRepository.update(req.params.id, req.body)
    if (!updatedInfo.id) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    res.status(HTTP_CODES.NO_CONTENT).send()
}