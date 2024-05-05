import {Request, Response} from "express"
import {blogRepository} from "../repository/blogRepository"
import {InputIdType} from "../../input-output-types/blog-types"
import {HTTP_CODES} from "../../settings"

export const findBlogController = async (req: Request<InputIdType>, res: Response) => {
    const foundInfo = await blogRepository.findById(req.params.id)

    if (!foundInfo.blog) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    res.status(HTTP_CODES.OK).send(foundInfo.blog)
}