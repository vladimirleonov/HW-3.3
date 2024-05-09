import {Request, Response} from 'express'
import {InputIdType} from '../../../input-output-types/blog-types'
import {HTTP_CODES} from '../../../settings'
import {blogMongoRepository} from "../repository/blogMongoRepository";
import {ObjectId} from "mongodb";

export const deleteBlogController = async (req: Request<InputIdType>, res: Response) => {
    try {
        const deletedInfo = await blogMongoRepository.delete(new ObjectId(req.params.id));

        if (deletedInfo.error) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}


// export const deleteBlogController = async (req: Request<InputIdType>, res: Response) => {
//     const deletedInfo = await blogRepository.delete(req.params.id);
//
//     if (deletedInfo.error) {
//         res.status(HTTP_CODES.NOT_FOUND).send()
//         return
//     }
//
//     res.status(HTTP_CODES.NO_CONTENT).send()
// }