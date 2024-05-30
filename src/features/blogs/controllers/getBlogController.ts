import {Request, Response} from "express"
import {InputIdParamType} from "../../../common/input-output-types/common-types"
import {HTTP_CODES} from "../../../settings"
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";
import {OutputBlogType} from "../input-output-types/blog-types";

export const getBlogController = async (req: Request<InputIdParamType>, res: Response) => {
    try {
        const blog: OutputBlogType | null = await blogMongoQueryRepository.findForOutputById(req.params.id)

        if (!blog) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.OK).send(blog)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}