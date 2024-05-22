import {Request, Response} from "express"
import {InputIdParamType} from "../../../common/input-output-types/common-types"
import {HTTP_CODES} from "../../../settings"
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";

export const findBlogController = async (req: Request<InputIdParamType>, res: Response) => {
    try {
        const foundInfo = await blogMongoQueryRepository.findForOutputById(req.params.id)

        if (foundInfo.error) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.OK).send(foundInfo.blog)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}