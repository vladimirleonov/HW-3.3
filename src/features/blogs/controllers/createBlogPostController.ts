import {Request, Response} from 'express';

import {InputBlogPostType, OutputPostType} from "../../posts/input-output-types/post-types";
import {HTTP_CODES} from "../../../settings";
import {InputBlogIdParamType} from "../input-output-types/blog-types";
import {postService} from "../../posts/services/postService";
import {postMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository";

export const createBlogPostController = async (req: Request<InputBlogIdParamType, OutputPostType, InputBlogPostType>, res: Response<OutputPostType>) => {
    try {
        const createdInfo = await postService.createBlogPost(req.body, req.params.blogId);
        if(createdInfo.error) {
            res.status(HTTP_CODES.NOT_FOUND)
        }

        const foundInfo = await postMongoQueryRepository.findForOutputById(createdInfo.id!)

        res.status(HTTP_CODES.CREATED).send(foundInfo.post)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}