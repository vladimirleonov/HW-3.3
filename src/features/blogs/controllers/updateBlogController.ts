import {Request, Response} from 'express'
import {InputIdParamType} from '../../../input-output-types/common-types'
import {HTTP_CODES} from '../../../settings'
import {ObjectId} from "mongodb"
import {InputBlogType, OutputBlogType} from "../types/blog-types";
import {blogService} from "../services/blogService";

export const updateBlogController = async (req: Request<InputIdParamType, OutputBlogType, InputBlogType>, res: Response<OutputBlogType>) => {
    try {
        const isUpdated = await blogService.updateBlog(req.params.id, req.body)

        if (!isUpdated) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}