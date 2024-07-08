import {Request, Response} from 'express'
import {commentMongoQueryRepository} from "../repository/commentMongoQueryRepository"
import {IdParamInputType} from "../../../common/input-output-types/common-types"
import {CommentOutputType} from "../input-output-types/comment-types"
import {HTTP_CODES} from "../../../settings"
import {Result, ResultStatus} from "../../../common/types/result";
import {JwtPayload} from "jsonwebtoken";
import {authService} from "../../auth/services/authService";

export const getCommentController = async (req: Request<IdParamInputType, CommentOutputType>, res: Response<CommentOutputType>) => {
    try {
        let userId = null
        if (req.headers.authorization) {
            const result: Result<JwtPayload | null> = await authService.checkAccessToken(req.headers.authorization)
            if (result.status === ResultStatus.Success) {
                userId = result.data!.userId
            }
        }
        console.log("userId", userId)

        const comment: CommentOutputType | null = await commentMongoQueryRepository.findForOutputById({userId: userId, commentId: req.params.id})
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