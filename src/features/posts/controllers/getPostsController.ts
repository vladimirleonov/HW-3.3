import {Request, Response} from "express"
import {HTTP_CODES} from "../../../settings"
import {PostPaginationOutputType} from "../input-output-types/post-types"
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository"
import {DefaultQueryParamsInputType} from "../../../common/input-output-types/common-types"
import {
    SanitizedDefaultQueryParamsType,
    sanitizeDefaultQueryParams
} from "../../../common/helpers/queryParamsSanitizer"

export const getPostsController = async (req: Request<{}, PostPaginationOutputType, DefaultQueryParamsInputType>, res: Response<PostPaginationOutputType>) => {
    try {
        const sanitizedQuery: SanitizedDefaultQueryParamsType = sanitizeDefaultQueryParams(req.query)
        const posts: PostPaginationOutputType = await postMongoQueryRepository.findAllForOutput(sanitizedQuery)
        res.status(HTTP_CODES.OK).send(posts)
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}