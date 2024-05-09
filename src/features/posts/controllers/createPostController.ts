import {Request, Response} from 'express'
import {postRepository} from "../repository/postRepository"
import {InputPostType, OutputPostType} from "../../../input-output-types/post-types"
import {HTTP_CODES} from "../../../settings"

export const createPostController = async (req: Request<{}, OutputPostType, InputPostType>, res: Response<OutputPostType>) => {

}

/*
export const createPostController = async (req: Request<{}, OutputPostType, InputPostType>, res: Response<OutputPostType>) => {
    const createdInfo = await postRepository.create(req.body)

    if (!createdInfo.id) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        return;
    }

    const foundPost = await postRepository.findById(createdInfo.id)
    if (!foundPost.post) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        return
    }

    res.status(HTTP_CODES.CREATED).send(foundPost.post)
}*/
