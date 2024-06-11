import {Request, Response} from 'express'

import {BlogPostInputType, PostOutputType} from "../../posts/input-output-types/post-types"
import {HTTP_CODES} from "../../../settings"
import {BlogIdParamInputType} from "../input-output-types/blog-types"
import {postService} from "../../posts/services/postService"
import {postMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository"
import {Result, ResultStatus} from "../../../common/types/result"

export const createBlogPostController = async (req: Request<BlogIdParamInputType, PostOutputType, BlogPostInputType>, res: Response<PostOutputType>) => {
    try {
        const result: Result<string | null> = await postService.createBlogPost(req.body, req.params.blogId)
        if (result.status === ResultStatus.NotFound) {
            res.status(HTTP_CODES.NOT_FOUND)
        }

        //?
        const post: PostOutputType | null = await postMongoQueryRepository.findForOutputById(result.data!)

        res.status(HTTP_CODES.CREATED).send(post!)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}