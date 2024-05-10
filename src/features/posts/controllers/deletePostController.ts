import {Request, Response} from 'express'
import {InputIdType} from '../../../input-output-types/post-types'
import {HTTP_CODES} from '../../../settings'
import { ObjectId } from 'mongodb'
import { postMongoRepository } from '../repository/postMongoRepository'

export const deletePostController = async (req: Request<InputIdType>, res: Response) => {
    try {
        const deletedInfo = await postMongoRepository.delete(new ObjectId(req.params.id))
        if (deletedInfo.error) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }   
        
        res.status(HTTP_CODES.NO_CONTENT).send()
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}

/*
export const deletePostController = async (req: Request<InputIdType>, res: Response) => {
    const deletedInfo = await postRepository.delete(req.params.id)
    if (deletedInfo.error) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    res.status(HTTP_CODES.NO_CONTENT).send()
}*/
