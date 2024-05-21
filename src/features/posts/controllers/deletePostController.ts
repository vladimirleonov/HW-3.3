import {Request, Response} from 'express'
import {InputIdParamType} from '../../../input-output-types/common-types'
import {HTTP_CODES} from '../../../settings'
import {postService} from "../services/postService";

export const deletePostController = async (req: Request<InputIdParamType>, res: Response) => {
    try {
        const deletedInfo: boolean = await postService.deletePost(req.params.id)
        if (!deletedInfo) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}