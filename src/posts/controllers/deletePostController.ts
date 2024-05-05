import {Request, Response} from 'express'
import {InputIdType} from '../../input-output-types/post-types'
import {HTTP_CODES} from '../../settings'
import {postRepository} from '../repository/postRepository'

export const deletePostController = async (req: Request<InputIdType>, res: Response) => {
    const deletedInfo = await postRepository.delete(req.params.id)
    if (deletedInfo.error) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    res.status(HTTP_CODES.NO_CONTENT).send()
}