import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings"
import {OutputBlogPaginationType} from '../../../input-output-types/blog-types'
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";
import {sanitizeQueryParams, SanitizedQueryParamsType} from "../../../helpers/queryParamsSanitizer";
import {InputQueryParamsType} from "../../../input-output-types/common-types";


export const getBlogsController = async (req: Request<{}, OutputBlogPaginationType, {}, InputQueryParamsType>, res: Response<OutputBlogPaginationType>) => {
    try {
        const sanitizedQuery: SanitizedQueryParamsType = sanitizeQueryParams(req.query)
        const blogs: OutputBlogPaginationType = await blogMongoQueryRepository.findAllForOutput(sanitizedQuery)

        res.status(HTTP_CODES.OK).send(blogs)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}