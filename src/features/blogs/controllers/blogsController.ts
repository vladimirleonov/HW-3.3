import {Request, Response} from "express";
import {
    BlogBodyInputType,
    BlogIdParamInputType,
    BlogOutputType, BlogsPaginationOutputType,
    BlogsQueryParamsInputType
} from "../input-output-types/blog-types";
import {Result, ResultStatus} from "../../../common/types/result";
import {blogService} from "../services/blogService";
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";
import {HTTP_CODES} from "../../../settings";
import {BlogPostInputType, PostOutputType, PostPaginationOutputType} from "../../posts/input-output-types/post-types";
import {postService} from "../../posts/services/postService";
import {postMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository";
import {IdParamInputType} from "../../../common/input-output-types/common-types";
import {
    SanitizedDefaultQueryParamsType,
    sanitizeDefaultQueryParams
} from "../../../common/helpers/queryParamsSanitizer";
import {sanitizeBlogsQueryParams, SanitizedBlogsQueryParamsType} from "../helpers/sanitizeBlogsQueryParams";

class BlogsController {
    async getBlogs (req: Request<{}, BlogsPaginationOutputType, {}, BlogsQueryParamsInputType>, res: Response<BlogsPaginationOutputType>) {
        try {
            const sanitizedQuery: SanitizedBlogsQueryParamsType = sanitizeBlogsQueryParams(req.query)
            const blogs: BlogsPaginationOutputType = await blogMongoQueryRepository.findAllForOutput(sanitizedQuery)

            res.status(HTTP_CODES.OK).send(blogs)
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async getBlog (req: Request<IdParamInputType>, res: Response) {
        try {
            const blog: BlogOutputType | null = await blogMongoQueryRepository.findForOutputById(req.params.id)
            if (!blog) {
                res.status(HTTP_CODES.NOT_FOUND).send()
                return
            }

            res.status(HTTP_CODES.OK).send(blog)
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async getBlogPosts (req: Request<BlogIdParamInputType, PostPaginationOutputType, {}, BlogsQueryParamsInputType>, res: Response<PostPaginationOutputType>) {
        try {
            const sanitizedQuery: SanitizedDefaultQueryParamsType = sanitizeDefaultQueryParams(req.query)
            const posts: PostPaginationOutputType = await postMongoQueryRepository.findAllForOutput(sanitizedQuery, req.params.blogId)
            res.status(HTTP_CODES.OK).send(posts)
        } catch (err) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
        }
    }
    async createBlog (req: Request<{}, BlogOutputType, BlogBodyInputType>, res: Response<BlogOutputType | string>) {
        try {
            const result: Result<string> = await blogService.createBlog(req.body)

            const blog: BlogOutputType | null = await blogMongoQueryRepository.findForOutputById(result.data)
            if (!blog) {
                // error if just created blog not found
                res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send('something went wrong');
                return;
            }

            res.status(HTTP_CODES.CREATED).send(blog!)

        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async createPostForBlog (req: Request<BlogIdParamInputType, PostOutputType, BlogPostInputType>, res: Response<PostOutputType | string>) {
        try {
            const result: Result<string | null> = await postService.createBlogPost(req.body, req.params.blogId)
            if (result.status === ResultStatus.NotFound) {
                res.status(HTTP_CODES.NOT_FOUND)
            }

            const post: PostOutputType | null = await postMongoQueryRepository.findForOutputById(result.data!)
            //?
            if(!post) {
                //error if just created post not found
                res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send('something went wrong');
                return;
            }

            res.status(HTTP_CODES.CREATED).send(post)
        } catch (err) {
            console.error(err)
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async updateBlog (req: Request<IdParamInputType, BlogOutputType, BlogBodyInputType>, res: Response<BlogOutputType>) {
        try {
            const result: Result<boolean> = await blogService.updateBlog(req.params.id, req.body)

            if (result.status === ResultStatus.NotFound) {
                res.status(HTTP_CODES.NOT_FOUND).send()
                return
            }

            res.status(HTTP_CODES.NO_CONTENT).send()
        } catch (err) {
            res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
        }
    }
    async deleteBlog (req: Request<IdParamInputType>, res: Response) {
        try {
            const deletedInfo: Result<boolean> = await blogService.deleteBlog(req.params.id)

            if (deletedInfo.status === ResultStatus.NotFound) {
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

export const blogsController: BlogsController = new BlogsController()