import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings"
import {OutputBlogType, BlogQueryParams} from '../../../input-output-types/blog-types'
import {blogMongoRepository} from "../repository/blogMongoRepository"
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";
import {sanitizeBlogQueryParams, SanitizedBlogQueryParamsType} from "../../../helpers/query-helper";


export const getBlogsController = async (req: Request<{}, {}, {}, BlogQueryParams>, res: Response<OutputBlogType[]>) => {
    try {
        const sanitizedQuery: SanitizedBlogQueryParamsType = sanitizeBlogQueryParams(req.query)
        const blogs: OutputBlogType[] = await blogMongoQueryRepository.findAllForOutput(sanitizedQuery)
        res.status(HTTP_CODES.OK).send(blogs)


        // const blogs: OutputBlogType[] = await blogMongoRepository.findAllForOutput(req.query)
        // res.status(HTTP_CODES.OK).send(blogs)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}



// export const getBlogsController = async (req: Request, res: Response<OutputBlogType[]>) => {
//     try {
//         const blogs: OutputBlogType[] = await blogMongoRepository.findAllForOutput()
//
//         res.status(HTTP_CODES.OK).send(blogs)
//     } catch (err) {
//         console.error(err)
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }