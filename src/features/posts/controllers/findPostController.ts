import {Request, Response} from 'express'
import {InputIdType, OutputPostType} from '../../../input-output-types/post-types'
import {HTTP_CODES} from '../../../settings'
import { postMongoRepository } from '../repository/postMongoRepository'
import { ObjectId } from 'mongodb'

export const findPostController = async (req: Request<InputIdType, OutputPostType>, res: Response<OutputPostType>) => {
    try {
        const foundInfo = await postMongoRepository.findForOutputById(new ObjectId(req.params.id))
        
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

/*
export const findPostController = async (req: Request<InputIdType>, res: Response<OutputPostType>) => {
    const foundInfo = await postRepository.findById(req.params.id)
    if (!foundInfo.post) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    res.status(HTTP_CODES.OK).send(foundInfo.post)
}*/
