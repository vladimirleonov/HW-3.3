import {Request, Response} from 'express'
import {blogRepository} from '../repository/blogRepository'
import {InputBlogType, InputIdType, OutputBlogType} from '../../../input-output-types/blog-types';
import {HTTP_CODES} from '../../../settings';
import {blogMongoRepository} from "../repository/blogMongoRepository";
import {ObjectId} from "mongodb";

export const updateBlogController = async (req: Request<InputIdType, OutputBlogType, InputBlogType>, res: Response<OutputBlogType>) => {
    try {
        const updatedInfo = await blogMongoRepository.update(new ObjectId(req.params.id), req.body);

        if (!updatedInfo?.id && updatedInfo?.error) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}



// export const updateBlogController = async (req: Request<InputIdType, OutputBlogType, InputBlogType>, res: Response<OutputBlogType>) => {
//     const updatedInfo = await blogRepository.update(req.params.id, req.body)
//     if (!updatedInfo.id) {
//         res.status(HTTP_CODES.NOT_FOUND).send()
//         return
//     }
//
//     res.status(HTTP_CODES.NO_CONTENT).send()
// }