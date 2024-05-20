import {Request, Response} from 'express'
import {InputIdParamType} from '../../../input-output-types/common-types'
import {HTTP_CODES} from '../../../settings'
import {ObjectId} from "mongodb"
import {blogService} from "../services/blogService";

export const deleteBlogController = async (req: Request<InputIdParamType>, res: Response) => {
    try {
        const deletedInfo = await blogService.deleteBlog(new ObjectId(req.params.id))

        if (deletedInfo.error) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}



// export const deleteBlogController = async (req: Request<InputIdParamType>, res: Response) => {
//     try {
//         const deletedInfo = await blogMongoRepository.delete(new ObjectId(req.params.id))
//
//         if (deletedInfo.error) {
//             res.status(HTTP_CODES.NOT_FOUND).send()
//             return
//         }
//
//         res.status(HTTP_CODES.NO_CONTENT).send()
//     } catch (err) {
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }