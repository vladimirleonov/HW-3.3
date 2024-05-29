import {Request, Response} from "express";
import {commentService} from "../services/commentService";
import {PostIdParamType} from "../../posts/input-output-types/post-types";
import {CommentInputType, CommentOutputType} from "../input-output-types/comment-types";
import {HTTP_CODES} from "../../../settings";
import {Result, ResultStatus} from "../../../common/types/result-type";
import {commentMongoQueryRepository} from "../repository/commentMongoQueryRepository";
import {ErrorsMessagesType} from "../../../common/types/errorsMessages";

export const createCommentController = async (req: Request<PostIdParamType, CommentOutputType, CommentInputType>, res: Response<CommentOutputType|ErrorsMessagesType>) => {
    try {
        // ? req.user?.userId!
        const result: Result<string | null> = await commentService.createComment(req.params.postId, req.body, req.user?.userId!);
        if (result.status === ResultStatus.NotFound) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        //?
        if (result.status === ResultStatus.Unauthorized) {
            console.log('unaaaaa')
            res.status(HTTP_CODES.UNAUTHORIZED).send()
            return
        }

        const comment: CommentOutputType | null = await commentMongoQueryRepository.findForOutputById(result.data!)
        // ?
        // if (!comment) {
        //     res.status(xxx).send()
        // }

        // ? !
        res.status(HTTP_CODES.CREATED).send(comment!)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}