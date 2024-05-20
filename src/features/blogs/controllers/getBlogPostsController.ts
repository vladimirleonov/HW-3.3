import {Request, Response} from 'express';
import {HTTP_CODES} from "../../../settings";
import {OutputPostPaginationType} from "../../../input-output-types/post-types";
import {InputQueryParamsType} from "../../../input-output-types/common-types";
import {postMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository";
import {SanitizedQueryParamsType, sanitizeQueryParams} from "../../../helpers/query-helpers";
import {ObjectId} from "mongodb";
import {InputBlogIdParamType} from "../../../input-output-types/blog-types";

export const getBlogPostsController = async (req: Request<InputBlogIdParamType, OutputPostPaginationType, {}, InputQueryParamsType>, res: Response<OutputPostPaginationType>) => {
    try {
        const sanitizedQuery: SanitizedQueryParamsType = sanitizeQueryParams(req.query)
        const posts: OutputPostPaginationType = await postMongoQueryRepository.findAllForOutput(sanitizedQuery, new ObjectId(req.params.blogId))
        res.status(HTTP_CODES.OK).send(posts);
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
}