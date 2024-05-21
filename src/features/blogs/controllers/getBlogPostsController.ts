import {Request, Response} from 'express';
import {HTTP_CODES} from "../../../settings";
import {OutputPostPaginationType} from "../../posts/types/post-types";
import {InputBlogsQueryParamsType} from "../../../input-output-types/common-types";
import {postMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository";
import {SanitizedDefaultQueryParamsType, sanitizeDefaultQueryParams} from "../../../helpers/queryParamsSanitizer";
import {InputBlogIdParamType} from "../types/blog-types";

export const getBlogPostsController = async (req: Request<InputBlogIdParamType, OutputPostPaginationType, {}, InputBlogsQueryParamsType>, res: Response<OutputPostPaginationType>) => {
    try {
        const sanitizedQuery: SanitizedDefaultQueryParamsType = sanitizeDefaultQueryParams(req.query)
        const posts: OutputPostPaginationType = await postMongoQueryRepository.findAllForOutput(sanitizedQuery, req.params.blogId)
        res.status(HTTP_CODES.OK).send(posts);
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
}