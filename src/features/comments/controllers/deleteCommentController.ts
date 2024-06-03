import {Request, Response} from 'express'
import {commentService} from "../services/commentService"
import {CommentIdParamInputType} from "../input-output-types/comment-types"
import {HTTP_CODES} from "../../../settings"
import {Result, ResultStatus} from "../../../common/types/result-type"

export const deleteCommentController = async (req: Request<CommentIdParamInputType>, res: Response) => {
    try {
        // ?
        if (!req.user || !req.user.userId) {
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }

        const result: Result<boolean | null> = await commentService.deleteComment(req.params.commentId, req.user.userId)
        if (result.status === ResultStatus.NotFound) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }
        if (result.status === ResultStatus.Forbidden) {
            res.status(HTTP_CODES.FORBIDDEN).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}