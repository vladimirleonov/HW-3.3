import {Request, Response} from 'express'
import {HTTP_CODES} from "../../../settings"
import {OutputBlogType} from '../../../input-output-types/blog-types'
import {blogMongoRepository} from "../repository/blogMongoRepository"

export const getBlogsController = async (req: Request, res: Response<OutputBlogType[]>) => {
    try {
        const blogs: OutputBlogType[] = await blogMongoRepository.findAllForOutput()

        res.status(HTTP_CODES.OK).send(blogs)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}