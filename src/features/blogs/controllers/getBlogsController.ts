import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings"
import {OutputBlogType, BlogQueryParams} from '../../../input-output-types/blog-types'
import {blogMongoRepository} from "../repository/blogMongoRepository"

const helper = (query: BlogQueryParams): BlogQueryParams => {
    return {
        searchNameTerm: query.searchNameTerm || null,
        sortBy: query.sortBy || 'createdAt',
        sortDirection: query.sortDirection || "desc",
        pageNumber: query.pageNumber || 1,
        pageSize: query.pageSize || 10,
    }
}

export const getBlogsController = async (req: Request<{}, {}, {}, BlogQueryParams>, res: Response<OutputBlogType[]>) => {
    try {
        const sanitizedQuery: BlogQueryParams = helper(req.query)
        const blogs: OutputBlogType[] = await blogMongoRepository.findAllForOutput(sanitizedQuery)


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