import {postMongoRepository} from "../repository/postMongoRepository";
import {ObjectId} from "mongodb";
import {InputBlogPostType, InputPostType} from "../input-output-types/post-types";
import {PostDbType} from "../../../db/db-types/post-db-types";
import {BlogDBType} from "../../../db/db-types/blog-db-types";
import {blogMongoRepository} from "../../blogs/repository/blogMongoRepository";
import {Result, ResultStatus} from "../../../common/types/result-type";

export const postService = {
    async createPost({blogId, ...restInput}: InputPostType): Promise<string> {
        const blog: BlogDBType | null = await blogMongoRepository.findById(blogId);

        if(!blog) {
            throw new Error('not found')
        }

        const newPost: PostDbType = {
            _id: new ObjectId(),
            ...restInput,
            blogId: new ObjectId(blogId),
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        return await postMongoRepository.create(newPost)
    },
    async createBlogPost(input: InputBlogPostType, blogId: string): Promise<Result<null | string>> {
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
    async deletePost(postId: string): Promise<boolean> {
        return postMongoRepository.delete(postId)
    },
    async updatePost(postId: string, input: InputPostType): Promise<boolean> {
        return postMongoRepository.update(postId, input)
    }
}