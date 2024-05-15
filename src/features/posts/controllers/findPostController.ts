import {Request, Response} from 'express'
import {OutputPostType} from '../../../input-output-types/post-types'
import {HTTP_CODES} from '../../../settings'
import {postMongoRepository} from '../repository/postMongoRepository'
import {ObjectId} from 'mongodb'
import {InputIdParamType} from "../../../input-output-types/common-types";
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository";

export const findPostController = async (req: Request<InputIdParamType, OutputPostType>, res: Response<OutputPostType>) => {
    try {
        const foundInfo = await postMongoQueryRepository.findForOutputById(new ObjectId(req.params.id))

        if (foundInfo.error) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.OK).send(foundInfo.post)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}