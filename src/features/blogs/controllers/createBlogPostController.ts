import {Request, Response} from 'express';
import {postMongoRepository} from "../../posts/repository/postMongoRepository";
import {ObjectId} from "mongodb";
import {InputBlogPostType, OutputPostType} from "../../../input-output-types/post-types";
import {HTTP_CODES} from "../../../settings";
import {InputBlogIdParamType} from "../../../input-output-types/blog-types";
import {postService} from "../../posts/services/postService";

export const createBlogPostController = async (req: Request<InputBlogIdParamType, OutputPostType, InputBlogPostType>, res: Response<OutputPostType>) => {
    try {
        const createdInfo = await postService.createBlogPost(req.body, new ObjectId(req.params.blogId));

        if (createdInfo.error) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.CREATED).send(createdInfo.post)
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}


// export const createBlogPostController = async (req: Request<InputBlogIdParamType, OutputPostType, InputBlogPostType>, res: Response<OutputPostType>) => {
//     try {
//         const createdInfo = await postMongoRepository.createBlogPost(req.body, new ObjectId(req.params.blogId));
//
//         if (createdInfo.error) {
//             res.status(HTTP_CODES.NOT_FOUND).send()
//             return
//         }
//
//         const foundInfo = await postMongoQueryRepository.findForOutputById(new ObjectId(createdInfo.id))
//
//         if (!foundInfo.post) {
//             res.status(HTTP_CODES.NOT_FOUND).send()
//             return
//         }
//
//         res.status(HTTP_CODES.CREATED).send(foundInfo.post)
//     } catch (err) {
//         res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
//     }
// }