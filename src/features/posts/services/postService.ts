import {postMongoRepository} from "../repository/postMongoRepository";
import {ObjectId} from "mongodb";
import {BlogPostInputType, PostBodyInputType} from "../input-output-types/post-types";
import {PostDbType} from "../../../db/db-types/post-db-types";
import {BlogDBType} from "../../../db/db-types/blog-db-types";
import {blogMongoRepository} from "../../blogs/repository/blogMongoRepository";
import {Result, ResultStatus} from "../../../common/types/result-type";

export const postService = {
    async createPost({blogId, ...restInput}: PostBodyInputType): Promise<Result<string | null>> {
        const blog: BlogDBType | null = await blogMongoRepository.findById(blogId);
        if(!blog) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{ field: 'blogId', message: `Blog with id ${blogId} not found` }],
                data: null
            }
        }

        const newPost: PostDbType = {
            _id: new ObjectId(),
            ...restInput,
            blogId: new ObjectId(blogId),
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        const createdPostId: string = await postMongoRepository.create(newPost)

        return {
            status: ResultStatus.Success,
            data: createdPostId
        }
    },
    async createBlogPost(input: BlogPostInputType, blogId: string): Promise<Result<string | null>> {
        const blog: BlogDBType | null = await blogMongoRepository.findById(blogId);
        if (!blog) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{ field: 'blogId', message: `Blog with id ${blogId} not found` }],
                data: null
            }
        }

        const newPost: PostDbType = {
            _id: new ObjectId(),
            ...input,
            blogId: new ObjectId(blogId),
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        const createdBlogId: string = await postMongoRepository.createBlogPost(newPost);

        return {
            status: ResultStatus.Success,
            data: createdBlogId
        }
    },
    async deletePost(postId: string): Promise<Result<boolean>> {
        const isDeleted: boolean = await postMongoRepository.delete(postId)
        return {
            status: ResultStatus.Success,
            data: isDeleted
        }
    },
    async updatePost(postId: string, input: PostBodyInputType): Promise<Result<boolean>> {
        const isUpdated = await postMongoRepository.update(postId, input)
        return {
            status: ResultStatus.Success,
            data: isUpdated
        }
    }
}