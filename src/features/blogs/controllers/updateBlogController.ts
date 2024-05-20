import {Request, Response} from 'express'
import {InputIdParamType} from '../../../input-output-types/common-types'
import {HTTP_CODES} from '../../../settings'
import {ObjectId} from "mongodb"
import {InputBlogType, OutputBlogType} from "../../../input-output-types/blog-types";
import {blogService} from "../services/blogService";

export const updateBlogController = async (req: Request<InputIdParamType, OutputBlogType, InputBlogType>, res: Response<OutputBlogType>) => {
    try {
        const updatedInfo = await blogService.updateBlog(new ObjectId(req.params.id), req.body)

        if (updatedInfo.error) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}

// export const updateBlogController = async (req: Request<InputIdParamType, OutputBlogType, InputBlogType>, res: Response<OutputBlogType>) => {
//     try {
//         const updatedInfo = await blogMongoRepository.update(new ObjectId(req.params.id), req.body)
//
//         if (!updatedInfo?.id && updatedInfo?.error) {
//             res.status(HTTP_CODES.NOT_FOUND).send()
//             return
//         }
//
//         res.status(HTTP_CODES.NO_CONTENT).send()
//     } catch (err) {
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }