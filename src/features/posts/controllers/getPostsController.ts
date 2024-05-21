import {Request, Response} from "express"
import {HTTP_CODES} from "../../../settings"
import {OutputPostPaginationType} from "../../../input-output-types/post-types"
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository";
import {InputQueryParamsType} from "../../../input-output-types/common-types";
import {SanitizedQueryParamsType, sanitizeDefaultQueryParams} from "../../../helpers/queryParamsSanitizer";

export const getPostsController = async (req: Request<{}, OutputPostPaginationType, InputQueryParamsType>, res: Response<OutputPostPaginationType>) => {
    try {
        const sanitizedQuery: SanitizedQueryParamsType = sanitizeDefaultQueryParams(req.query)
        const posts: OutputPostPaginationType = await postMongoQueryRepository.findAllForOutput(sanitizedQuery)
        res.status(HTTP_CODES.OK).send(posts)
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}