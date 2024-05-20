import {Request, Response} from 'express'
import {InputIdParamType} from '../../../input-output-types/common-types'
import {HTTP_CODES} from '../../../settings'
import {ObjectId} from 'mongodb'
import {postService} from "../services/postService";

export const deletePostController = async (req: Request<InputIdParamType>, res: Response) => {
    try {
        const deletedInfo = await postService.deletePost(new ObjectId(req.params.id))
        if (deletedInfo.error) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}


// export const deletePostController = async (req: Request<InputIdParamType>, res: Response) => {
//     try {
//         const deletedInfo = await postMongoRepository.delete(new ObjectId(req.params.id))
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