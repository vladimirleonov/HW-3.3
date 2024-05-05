import {Request, Response} from "express"
import {HTTP_CODES} from "../../settings"
import {postRepository} from "../repository/postRepository"
import {OutputPostType} from "../../input-output-types/post-types"

export const getPostsController = async (req: Request, res: Response<OutputPostType[]>) => {
    const foundInfo = await postRepository.find()
    if (!foundInfo.posts) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        return
    }

    res.status(HTTP_CODES.OK).send(foundInfo.posts)
}