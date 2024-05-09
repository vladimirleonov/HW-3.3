import {Request, Response} from 'express'
import {InputIdType, OutputPostType} from '../../../input-output-types/post-types'
import {postRepository} from '../repository/postRepository'
import {HTTP_CODES} from '../../../settings'

export const findPostController = (req: Request<InputIdType, OutputPostType>, res: Response<OutputPostType>) => {}

/*
export const findPostController = async (req: Request<InputIdType>, res: Response<OutputPostType>) => {
    const foundInfo = await postRepository.findById(req.params.id)
    if (!foundInfo.post) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    res.status(HTTP_CODES.OK).send(foundInfo.post)
}*/
