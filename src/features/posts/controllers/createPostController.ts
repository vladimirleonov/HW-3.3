import {Request, Response} from 'express'
import {InputPostType, OutputPostType} from "../types/post-types"
import {HTTP_CODES} from "../../../settings"
import {postService} from "../services/postService";
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository";

export const createPostController = async (req: Request<{}, OutputPostType, InputPostType>, res: Response<OutputPostType>) => {
    try {
        const createdPostId: string = await postService.createPost(req.body)

        const foundInfo = await postMongoQueryRepository.findForOutputById(createdPostId)

        res.status(HTTP_CODES.CREATED).send(foundInfo.post)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}