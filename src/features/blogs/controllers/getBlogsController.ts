import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings"
import {OutputBlogType} from '../../../input-output-types/blog-types'
import {blogMongoRepository} from "../repository/blogMongoRepository"
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";
import {sanitizeQueryParams, SanitizedQueryParamsType} from "../../../helpers/query-helpers";
import {QueryParamsType} from "../../../input-output-types/common-types";


export const getBlogsController = async (req: Request<{}, {}, {}, QueryParamsType>, res: Response<OutputBlogType[]>) => {
    try {
        const sanitizedQuery: SanitizedQueryParamsType = sanitizeQueryParams(req.query)
        const blogs: OutputBlogType[] = await blogMongoQueryRepository.findAll(sanitizedQuery)
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