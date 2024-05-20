import {postMongoRepository} from "../repository/postMongoRepository";
import {ObjectId} from "mongodb";
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository";
import {InputBlogPostType, InputPostType, OutputPostType} from "../../../input-output-types/post-types";
import {HTTP_CODES} from "../../../settings";

export const postService = {
    async createPost(input: InputPostType) {
        try {
            const createdInfo = await postMongoRepository.create(input)
            // custom validator
            // if (createdInfo.error) {
            //     res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
            //     return
            // }

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
        try {
            const createdInfo = await postMongoRepository.createBlogPost(input, blogId);
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