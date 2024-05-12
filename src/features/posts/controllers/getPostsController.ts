import {Request, Response} from "express"
import {HTTP_CODES} from "../../../settings"
import {OutputPostType} from "../../../input-output-types/post-types"
import {postMongoRepository} from "../repository/postMongoRepository"

export const getPostsController = async (req: Request, res: Response<OutputPostType[]>) => {
    try {
        const posts: OutputPostType[] = await postMongoRepository.findAllForOutput()
        res.status(HTTP_CODES.OK).send(posts)
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}