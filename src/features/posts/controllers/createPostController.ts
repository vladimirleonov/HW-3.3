import {Request, Response} from 'express'
import {PostBodyInputType, PostOutputType} from "../input-output-types/post-types"
import {HTTP_CODES} from "../../../settings"
import {postService} from "../services/postService";
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository";

export const createPostController = async (req: Request<{}, PostOutputType, PostBodyInputType>, res: Response<PostOutputType>) => {
    try {
        const createdPostId: string = await postService.createPost(req.body)

        const post = await postMongoQueryRepository.findForOutputById(createdPostId)

        res.status(HTTP_CODES.CREATED).send(post)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}