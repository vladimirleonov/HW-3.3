import {postMongoRepository} from "../repository/postMongoRepository";
import {ObjectId} from "mongodb";
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository";
import {InputBlogPostType} from "../../../input-output-types/post-types";

export const postService = {
    async createBlogPost (input: InputBlogPostType, blogId: ObjectId) {
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
    }
}