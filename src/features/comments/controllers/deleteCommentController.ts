import {Request, Response} from 'express'
import {commentService} from "../services/commentService";
import {CommentIdParamType} from "../input-output-types/comment-types";
import {HTTP_CODES} from "../../../settings";
import {Result, ResultStatus} from "../../../common/types/result-type";

export const deleteCommentController = async (req: Request<CommentIdParamType>, res: Response) => {
    try {
        // ?
        if(!req.user || !req.user.userId){
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }

        const result: Result<boolean | null> = await commentService.deleteComment(req.params.commentId, req.user.userId)
        if(result.status === ResultStatus.NotFound){
            res.status(HTTP_CODES.NOT_FOUND).send()
        }
        if(result.status === ResultStatus.Forbidden){
            res.status(HTTP_CODES.FORBIDDEN).send()
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.log(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}