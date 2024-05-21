import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings"
import {OutputBlogPaginationType} from '../../../input-output-types/blog-types'
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";
import {sanitizeBlogsQueryParams, SanitizedBlogsQueryParamsType} from "../../../helpers/queryParamsSanitizer";
import {InputBlogsQueryParamsType} from "../../../input-output-types/common-types";


export const getBlogsController = async (req: Request<{}, OutputBlogPaginationType, {}, InputBlogsQueryParamsType>, res: Response<OutputBlogPaginationType>) => {
    try {
        const sanitizedQuery: SanitizedBlogsQueryParamsType = sanitizeBlogsQueryParams(req.query)
        const blogs: OutputBlogPaginationType = await blogMongoQueryRepository.findAllForOutput(sanitizedQuery)

        res.status(HTTP_CODES.OK).send(blogs)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}