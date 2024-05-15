import {Request, Response} from 'express';
import {HTTP_CODES} from "../../../settings";
import {OutputPostPaginationType, OutputPostType} from "../../../input-output-types/post-types";
import {QueryParamsType} from "../../../input-output-types/common-types";
import {postMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository";
import {SanitizedQueryParamsType, sanitizeQueryParams} from "../../../helpers/query-helpers";
import {ObjectId} from "mongodb";

export const getBlogPostsController = async (req: Request<{blogId: string}, OutputPostPaginationType, {}, QueryParamsType>, res: Response<OutputPostPaginationType>) => {
    try {
        const sanitizedQuery: SanitizedQueryParamsType = sanitizeQueryParams(req.query)
        const posts: OutputPostPaginationType = await postMongoQueryRepository.findAll(sanitizedQuery, new ObjectId(req.params.blogId))
        res.status(HTTP_CODES.OK).send(posts);
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
}