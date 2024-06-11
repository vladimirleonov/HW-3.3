import {Request, Response} from 'express'
import {commentService} from "../services/commentService"
import {HTTP_CODES} from "../../../settings"
import {CommentIdParamInputType, CommentBodyInputType} from "../input-output-types/comment-types"
import {Result, ResultStatus} from "../../../common/types/result"

export const updateCommentController = async (req: Request<CommentIdParamInputType, {}, CommentBodyInputType>, res: Response) => {
    try {
        // ?
        if (!req.user || !req.user.userId) {
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }

        const result: Result = await commentService.updateComment(req.params.commentId, req.body, req.user.userId)

        if (result.status === ResultStatus.NotFound) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        } else if (result.status === ResultStatus.Forbidden) {
            res.status(HTTP_CODES.FORBIDDEN).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}