import {Request, Response} from 'express'
import {OutputPostType} from '../../../input-output-types/post-types'
import {HTTP_CODES} from '../../../settings'
import {InputIdParamType} from "../../../input-output-types/common-types";
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository";

export const findPostController = async (req: Request<InputIdParamType, OutputPostType>, res: Response<OutputPostType>) => {
    try {
        const foundInfo: OutputPostType = await postMongoQueryRepository.findForOutputById(req.params.id)

        if (!foundInfo) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.OK).send(foundInfo)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}