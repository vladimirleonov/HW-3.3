import {Request, Response} from 'express'
import {postRepository} from "../repository/postRepository"
import {InputIdType, InputPostType} from "../../input-output-types/post-types"
import {HTTP_CODES} from "../../settings"

export const updatePostController = async (req: Request<InputIdType, InputPostType>, res: Response) => {
    const updatedInfo = await postRepository.update(req.params.id, req.body)
    if (updatedInfo.error) {
        res.status(HTTP_CODES.NOT_FOUND).send()
        return
    }

    res.status(HTTP_CODES.NO_CONTENT).send()
}