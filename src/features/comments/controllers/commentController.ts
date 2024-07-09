import {Request, Response} from "express"
import {PostIdParamType, PostOutputType} from "../../posts/input-output-types/post-types"
import {
    CommentBodyInputType, CommentIdParamInputType,
    CommentOutputType,
    CommentsPaginationOutputType
} from "../input-output-types/comment-types"
import {Result, ResultStatus} from "../../../common/types/result"
import {JwtPayload} from "jsonwebtoken"
import {authService} from "../../auth/services/authService"
import {
    SanitizedDefaultQueryParamsType,
    sanitizeDefaultQueryParams
} from "../../../common/helpers/queryParamsSanitizer"
import {PostMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository"
import {HTTP_CODES} from "../../../settings"
import {CommentMongoQueryRepository} from "../repository/commentMongoQueryRepository"
import {IdParamInputType} from "../../../common/input-output-types/common-types"
import {CommentService} from "../services/commentService"
import {LikeBodyInputControllerType} from "../input-output-types/comment-like-types"

class CommentController {
    commentMongoQueryRepository: CommentMongoQueryRepository
    postMongoQueryRepository: PostMongoQueryRepository
    commentService: CommentService
    constructor() {
        this.commentMongoQueryRepository = new CommentMongoQueryRepository()
        this.postMongoQueryRepository = new PostMongoQueryRepository()
        this.commentService = new CommentService()
    }
    async getPostComments (req: Request<PostIdParamType, CommentsPaginationOutputType>, res: Response<CommentsPaginationOutputType>) {
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
        const post: PostOutputType | null  = await this.postMongoQueryRepository.findForOutputById(req.params.postId)
        if (!post) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        const comments: CommentsPaginationOutputType = await this.commentMongoQueryRepository.findAllPostCommentsForOutput(sanitizedQuery, req.params.postId, userId)

        res.status(HTTP_CODES.OK).send(comments)
    }
    async getComment (req: Request<IdParamInputType, CommentOutputType>, res: Response<CommentOutputType>) {
        try {
            let userId = null
            if (req.headers.authorization) {
                const result: Result<JwtPayload | null> = await authService.checkAccessToken(req.headers.authorization)
                if (result.status === ResultStatus.Success) {
                    userId = result.data!.userId
                }
            }
            console.log("userId", userId)

            const comment: CommentOutputType | null = await this.commentMongoQueryRepository.findForOutputById({userId: userId, commentId: req.params.id})
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
    async createPostComment (req: Request<PostIdParamType, CommentOutputType, CommentBodyInputType>, res: Response<CommentOutputType | string>) {
        try {
            //?
            if (!req.user || !req.user.userId) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const result: Result<string | null> = await this.commentService.createComment(req.params.postId, req.body, req.user.userId)
            if (result.status === ResultStatus.NotFound) {
                res.status(HTTP_CODES.NOT_FOUND).send()
                return
            }

            if (result.status === ResultStatus.Unauthorized) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const comment: CommentOutputType | null = await this.commentMongoQueryRepository.findForOutputById({commentId: result.data!, userId: req.user.userId})
            //?
            if(!comment) {
                //error if just created comment not found
                res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send('something went wrong')
                return
            }

            res.status(HTTP_CODES.CREATED).send(comment)
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async updateComment (req: Request<CommentIdParamInputType, {}, CommentBodyInputType>, res: Response) {
        try {
            // ?
            if (!req.user || !req.user.userId) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const result: Result = await this.commentService.updateComment(req.params.commentId, req.body, req.user.userId)

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
    async updateLikeStatus (req: Request<CommentIdParamInputType, {}, LikeBodyInputControllerType>, res: Response) {
        try {
            if (!req.user || !req.user.userId) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const dto = {
                commentId: req.params.commentId,
                likeStatus: req.body.likeStatus,
                userId: req.user.userId
            }

            const result: Result = await this.commentService.updateLikeStatus(dto)
            if (result.status === ResultStatus.NotFound) {
                res.status(HTTP_CODES.NOT_FOUND).send()
                return
            }

            res.status(HTTP_CODES.NO_CONTENT).send()
        } catch(err) {
            console.error("updateLikeStatusController", err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async deleteComment (req: Request<CommentIdParamInputType>, res: Response) {
        try {
            // ?
            if (!req.user || !req.user.userId) {
                res.status(HTTP_CODES.UNAUTHORIZED).send()
                return
            }

            const result: Result<boolean | null> = await this.commentService.deleteComment(req.params.commentId, req.user.userId)
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
}

export const commentController: CommentController = new CommentController()