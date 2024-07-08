import {Request, Response} from 'express'
import {PostIdParamType, PostOutputType} from "../../posts/input-output-types/post-types"
import {CommentsPaginationOutputType} from "../input-output-types/comment-types"
import {
    SanitizedDefaultQueryParamsType,
    sanitizeDefaultQueryParams
} from "../../../common/helpers/queryParamsSanitizer"
import {commentMongoQueryRepository} from "../repository/commentMongoQueryRepository"
import {postMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository"
import {HTTP_CODES} from "../../../settings"
import {Result, ResultStatus} from "../../../common/types/result";
import {JwtPayload} from "jsonwebtoken";
import {authService} from "../../auth/services/authService";

export const getPostCommentsController = async (req: Request<PostIdParamType, CommentsPaginationOutputType>, res: Response<CommentsPaginationOutputType>) => {
    let userId = null
    if (req.headers.authorization) {
        const result: Result<JwtPayload | null> = await authService.checkAccessToken(req.headers.authorization)
        if (result.status === ResultStatus.Success) {
            userId = result.data!.userId
        }
    }
    console.log("userId", userId)

    const sanitizedQuery: SanitizedDefaultQueryParamsType = sanitizeDefaultQueryParams(req.query)

    //? in service
    const post: PostOutputType | null  = await postMongoQueryRepository.findForOutputById(req.params.postId)
    if (!post) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    const comments: CommentsPaginationOutputType = await commentMongoQueryRepository.findAllPostCommentsForOutput(sanitizedQuery, req.params.postId, userId)

    res.status(HTTP_CODES.OK).send(comments)
}