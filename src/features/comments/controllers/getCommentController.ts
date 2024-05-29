import {Request, Response} from 'express';
import {commentMongoQueryRepository} from "../repository/commentMongoQueryRepository";
import {InputIdParamType} from "../../../common/input-output-types/common-types";
import {CommentOutputType} from "../input-output-types/comment-types";
import {HTTP_CODES} from "../../../settings";

export const getCommentController = async (req: Request<InputIdParamType, CommentOutputType>, res: Response<CommentOutputType>) => {
    try {
        const comment: CommentOutputType | null = await commentMongoQueryRepository.findForOutputById(req.params.id);
        if (!comment) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.OK).send(comment)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}