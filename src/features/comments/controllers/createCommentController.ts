import {Request, Response} from "express"
import {commentService} from "../services/commentService"
import {PostIdParamType} from "../../posts/input-output-types/post-types"
import {CommentBodyInputType, CommentOutputType} from "../input-output-types/comment-types"
import {HTTP_CODES} from "../../../settings"
import {Result, ResultStatus} from "../../../common/types/result"
import {commentMongoQueryRepository} from "../repository/commentMongoQueryRepository"
import {ErrorsMessagesType} from "../../../common/types/errorMessageType"

export const createCommentController = async (req: Request<PostIdParamType, CommentOutputType, CommentBodyInputType>, res: Response<CommentOutputType | string>) => {
    try {
        //?
        if (!req.user || !req.user.userId) {
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }

        const result: Result<string | null> = await commentService.createComment(req.params.postId, req.body, req.user.userId)
        if (result.status === ResultStatus.NotFound) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        if (result.status === ResultStatus.Unauthorized) {
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }

        const comment: CommentOutputType | null = await commentMongoQueryRepository.findForOutputById({commentId: result.data!, userId: req.user.userId})
        //?
        if(!comment) {
            //error if just created comment not found
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send('something went wrong');
            return;
        }

        res.status(HTTP_CODES.CREATED).send(comment)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}