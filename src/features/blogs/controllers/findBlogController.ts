import {Request, Response} from "express"
import {InputIdParamType} from "../../../input-output-types/common-types"
import {HTTP_CODES} from "../../../settings"
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";
import {OutputBlogType} from "../../../input-output-types/blog-types";

export const findBlogController = async (req: Request<InputIdParamType>, res: Response) => {
    try {
        const foundBlog: OutputBlogType = await blogMongoQueryRepository.findForOutputById(req.params.id)

        if (!foundBlog) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.OK).send(foundBlog)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}