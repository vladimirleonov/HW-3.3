import {postMongoRepository} from "../repository/postMongoRepository";
import {ObjectId} from "mongodb";
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository";
import {InputBlogPostType, InputPostType, OutputPostType} from "../../../input-output-types/post-types";
import {PostDbType} from "../../../db/db-types/post-db-types";
import {BlogDBType} from "../../../db/db-types/blog-db-types";
import {blogMongoQueryRepository} from "../../blogs/repository/blogMongoQueryRepository";
import {blogMongoRepository} from "../../blogs/repository/blogMongoRepository";

export const postService = {
    async createPost({blogId, ...restInput}: InputPostType): Promise<string> {
        const blog = await blogMongoQueryRepository.findById(new ObjectId(blogId)) as NonNullable<BlogDBType>;

        if(!blog) {
            throw new Error('not found')
        }

        // if (!blog) {
        //     return {error: 'Blog not found'}
        // }

        const newPost: PostDbType = {
            _id: new ObjectId(),
            ...restInput,
            blogId: new ObjectId(blogId),
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        try {
            const createdInfo = await postMongoRepository.create(newPost)

            const foundInfo = await postMongoQueryRepository.findForOutputById(new ObjectId(createdInfo.id))
            // if (foundInfo.error) {
            //     res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
            //     return
            // }

            return {post: foundInfo.post} as { post: OutputPostType }
        } catch (err) {
            console.error(err)
            throw new Error("Failed to create post")
        }
    },
    async createBlogPost(input: InputBlogPostType, blogId: ObjectId) {
        const blog: BlogDBType | null = await blogMongoQueryRepository.findById(blogId) as NonNullable<BlogDBType>;
        // if (!blog) {
        //     return {error: 'Blog not found'}
        // }

        const newPost: PostDbType = {
            _id: new ObjectId(),
            ...input,
            blogId: blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        try {
            const createdInfo = await postMongoRepository.createBlogPost(newPost);
            if (createdInfo.error) {
                return {error: "Blog doesn't exist"}
            }

            const foundInfo = await postMongoQueryRepository.findForOutputById(new ObjectId(createdInfo.id))
            // if (foundInfo.error) {
            //     return {error: 'Post not found'}
            // }

            return {post: foundInfo.post}
        } catch (err) {
            console.error(err)
            throw new Error("Failed to create post")
        }
    },
    async deletePost(postId: ObjectId): Promise<{ success?: boolean, error?: string }> {
        return postMongoRepository.delete(postId)
    },
    async updatePost(postId: ObjectId, input: InputPostType): Promise<{ id?: string, error?: string }> {
        try {
            const updatedInfo = await postMongoRepository.update(postId, input)

            if (updatedInfo.error) {
                return {error: 'Post not found'}
            }

            return {id: updatedInfo.id}
        } catch (err) {
            console.error(err)
            throw new Error("Failed to create post")
        }
        // return postMongoRepository.update(postId, input)
    }
}