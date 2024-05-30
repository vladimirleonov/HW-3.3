import {Request, Response} from 'express'
import {PostIdParamType} from "../../posts/input-output-types/post-types";
import {OutputCommentsPaginationType} from "../input-output-types/comment-types";
import {
    SanitizedDefaultQueryParamsType,
    sanitizeDefaultQueryParams
} from "../../../common/helpers/queryParamsSanitizer";
import {commentMongoQueryRepository} from "../repository/commentMongoQueryRepository";
import {postMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository";
import {HTTP_CODES} from "../../../settings";

export const getPostCommentsController = async (req: Request<PostIdParamType, OutputCommentsPaginationType>, res: Response<OutputCommentsPaginationType>) => {
    const sanitizedQuery: SanitizedDefaultQueryParamsType = sanitizeDefaultQueryParams(req.query)

    //? service may
    const foundInfo = await postMongoQueryRepository.findForOutputById(req.params.postId)
    if (!foundInfo.post) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    const comments: OutputCommentsPaginationType = await commentMongoQueryRepository.findAllPostCommentsForOutput(sanitizedQuery, req.params.postId)

    res.status(HTTP_CODES.OK).send(comments)
}