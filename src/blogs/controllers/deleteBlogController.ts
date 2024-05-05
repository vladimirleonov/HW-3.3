import {Request, Response} from 'express'
import {InputIdType} from '../../input-output-types/blog-types'
import {blogRepository} from '../repository/blogRepository'
import {HTTP_CODES} from '../../settings'

export const deleteBlogController = async (req: Request<InputIdType>, res: Response) => {
    const deletedInfo = await blogRepository.delete(req.params.id);

    if (deletedInfo.error) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    res.status(HTTP_CODES.NO_CONTENT).send()
}