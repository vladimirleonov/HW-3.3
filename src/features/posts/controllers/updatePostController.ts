import {Request, Response} from 'express'
import {InputPostType, OutputPostType} from "../input-output-types/post-types"
import {HTTP_CODES} from "../../../settings"
import {InputIdParamType} from "../../../common/input-output-types/common-types";
import {postService} from "../services/postService";

export const updatePostController = async (req: Request<InputIdParamType, OutputPostType, InputPostType>, res: Response<OutputPostType>) => {
    try {
        const isUpdated: boolean = await postService.updatePost(req.params.id, req.body)

        if (!isUpdated) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}