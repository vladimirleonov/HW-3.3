import {Request, Response} from 'express'
import {PostBodyInputType, PostOutputType} from "../input-output-types/post-types"
import {HTTP_CODES} from "../../../settings"
import {IdParamInputType} from "../../../common/input-output-types/common-types";
import {postService} from "../services/postService";
import {Result, ResultStatus} from "../../../common/types/result-type";

export const updatePostController = async (req: Request<IdParamInputType, PostOutputType, PostBodyInputType>, res: Response<PostOutputType>) => {
    try {
        const result: Result<boolean | null> = await postService.updatePost(req.params.id, req.body)

        if (result.status === ResultStatus.NotFound) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}