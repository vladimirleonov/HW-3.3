import {Request, Response} from 'express'
import {InputPostType, OutputPostType} from "../../../input-output-types/post-types"
import {HTTP_CODES} from "../../../settings"
import {postService} from "../services/postService";

export const createPostController = async (req: Request<{}, OutputPostType, InputPostType>, res: Response<OutputPostType>) => {
    try {
        const createdInfo: { post: OutputPostType } = await postService.createPost(req.body)

        res.status(HTTP_CODES.CREATED).send(createdInfo.post)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}


// export const createPostController = async (req: Request<{}, OutputPostType, InputPostType>, res: Response<OutputPostType>) => {
//     try {
//         const createdInfo = await postMongoRepository.create(req.body)
//         if (createdInfo.error) {
//             res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//             return
//         }
//
//         const foundInfo = await postMongoQueryRepository.findForOutputById(new ObjectId(createdInfo.id))
//         if (!foundInfo.post && foundInfo.error) {
//             res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//             return
//         }
//
//         res.status(HTTP_CODES.CREATED).send(foundInfo.post)
//     } catch (err) {
//         console.error(err)
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }