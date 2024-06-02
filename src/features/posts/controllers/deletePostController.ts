import {Request, Response} from 'express'
import {IdParamInputType} from '../../../common/input-output-types/common-types'
import {HTTP_CODES} from '../../../settings'
import {postService} from "../services/postService";
import {Result, ResultStatus} from "../../../common/types/result-type";

export const deletePostController = async (req: Request<IdParamInputType>, res: Response) => {
    try {
        const result: Result<boolean | null> = await postService.deletePost(req.params.id)
        if (result.status === ResultStatus.NotFound) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}