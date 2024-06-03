import {Request, Response} from 'express'
import {IdParamInputType} from '../../../common/input-output-types/common-types'
import {HTTP_CODES} from '../../../settings'
import {blogService} from "../services/blogService"
import {Result, ResultStatus} from "../../../common/types/result-type"

export const deleteBlogController = async (req: Request<IdParamInputType>, res: Response) => {
    try {
        const deletedInfo: Result<boolean> = await blogService.deleteBlog(req.params.id)

        if (deletedInfo.status === ResultStatus.NotFound) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}