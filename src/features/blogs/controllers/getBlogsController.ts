// import {Request, Response} from 'express'
// import {HTTP_CODES} from "../../../settings"
// import {BlogsQueryParamsInputType, BlogsPaginationOutputType} from '../input-output-types/blog-types'
// import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository"
// import {sanitizeBlogsQueryParams, SanitizedBlogsQueryParamsType} from "../helpers/sanitizeBlogsQueryParams"
//
// export const getBlogsController = async (req: Request<{}, BlogsPaginationOutputType, {}, BlogsQueryParamsInputType>, res: Response<BlogsPaginationOutputType>) => {
//     try {
//         const sanitizedQuery: SanitizedBlogsQueryParamsType = sanitizeBlogsQueryParams(req.query)
//         const blogs: BlogsPaginationOutputType = await blogMongoQueryRepository.findAllForOutput(sanitizedQuery)
//
//         res.status(HTTP_CODES.OK).send(blogs)
//     } catch (err) {
//         console.error(err)
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }