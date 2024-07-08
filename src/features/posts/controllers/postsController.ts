import {Request, Response} from "express";
import {DefaultQueryParamsInputType, IdParamInputType} from "../../../common/input-output-types/common-types";
import {PostBodyInputType, PostOutputType, PostPaginationOutputType} from "../input-output-types/post-types";
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository";
import {HTTP_CODES} from "../../../settings";
import {
    SanitizedDefaultQueryParamsType,
    sanitizeDefaultQueryParams
} from "../../../common/helpers/queryParamsSanitizer";
import {Result, ResultStatus} from "../../../common/types/result";
import {postService} from "../services/postService";

class PostsController {
    async getPosts (req: Request<{}, PostPaginationOutputType, DefaultQueryParamsInputType>, res: Response<PostPaginationOutputType>) {
        try {
            const sanitizedQuery: SanitizedDefaultQueryParamsType = sanitizeDefaultQueryParams(req.query)
            const posts: PostPaginationOutputType = await postMongoQueryRepository.findAllForOutput(sanitizedQuery)
            res.status(HTTP_CODES.OK).send(posts)
        } catch (err) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async getPost (req: Request<IdParamInputType, PostOutputType>, res: Response<PostOutputType>) {
        try {
            const post: PostOutputType | null = await postMongoQueryRepository.findForOutputById(req.params.id)

            if (!post) {
                res.status(HTTP_CODES.NOT_FOUND).send()
                return
            }

            res.status(HTTP_CODES.OK).send(post)
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async createPost (req: Request<{}, PostOutputType, PostBodyInputType>, res: Response<PostOutputType | string>) {
        try {
            const result: Result<string | null> = await postService.createPost(req.body)

            const post: PostOutputType | null = await postMongoQueryRepository.findForOutputById(result.data!)
            if (!post) {
                // error if just created post not found
                res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send('something went wrong');
                return;
            }

            res.status(HTTP_CODES.CREATED).send(post!)
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async updatePost (req: Request<IdParamInputType, PostOutputType, PostBodyInputType>, res: Response<PostOutputType>) {
        try {
            const result: Result<boolean | null> = await postService.updatePost(req.params.id, req.body)

            if (result.status === ResultStatus.NotFound) {
                res.status(HTTP_CODES.NOT_FOUND).send()
                return
            }

            res.status(HTTP_CODES.NO_CONTENT).send()
        } catch (err) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async deletePost (req: Request<IdParamInputType>, res: Response) {
        try {
            const result: Result<boolean | null> = await postService.deletePost(req.params.id)
            if (result.status === ResultStatus.NotFound) {
                res.status(HTTP_CODES.NOT_FOUND).send()
                return
            }

            res.status(HTTP_CODES.NO_CONTENT).send()
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
}

export const postsController: PostsController = new PostsController()