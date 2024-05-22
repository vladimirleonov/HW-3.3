import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings"
import {InputBlogsQueryParamsType, OutputBlogsPaginationType} from '../input-output-types/blog-types'
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";
import {sanitizeBlogsQueryParams, SanitizedBlogsQueryParamsType} from "../helpers/sanitizeBlogsQueryParams";

export const getBlogsController = async (req: Request<{}, OutputBlogsPaginationType, {}, InputBlogsQueryParamsType>, res: Response<OutputBlogsPaginationType>) => {
    try {
        const sanitizedQuery: SanitizedBlogsQueryParamsType = sanitizeBlogsQueryParams(req.query)
        const blogs: OutputBlogsPaginationType = await blogMongoQueryRepository.findAllForOutput(sanitizedQuery)

        res.status(HTTP_CODES.OK).send(blogs)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}