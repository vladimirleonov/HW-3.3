import {Request, Response} from 'express'
import {PostIdParamType} from "../../posts/input-output-types/post-types";
import {CommentsPaginationOutputType} from "../input-output-types/comment-types";
import {
    SanitizedDefaultQueryParamsType,
    sanitizeDefaultQueryParams
} from "../../../common/helpers/queryParamsSanitizer";
import {commentMongoQueryRepository} from "../repository/commentMongoQueryRepository";
import {postMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository";
import {HTTP_CODES} from "../../../settings";

export const getPostCommentsController = async (req: Request<PostIdParamType, CommentsPaginationOutputType>, res: Response<CommentsPaginationOutputType>) => {
    const sanitizedQuery: SanitizedDefaultQueryParamsType = sanitizeDefaultQueryParams(req.query)

    //? service may
    const post = await postMongoQueryRepository.findForOutputById(req.params.postId)
    if (!post) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    const comments: CommentsPaginationOutputType = await commentMongoQueryRepository.findAllPostCommentsForOutput(sanitizedQuery, req.params.postId)

    res.status(HTTP_CODES.OK).send(comments)
}