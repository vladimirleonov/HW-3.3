import {blogMongoRepository} from "../repository/blogMongoRepository";
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";
import {ObjectId} from "mongodb";
import {InputBlogType, OutputBlogType} from "../../../input-output-types/blog-types";

export const blogService = {
    async createBlog(input: InputBlogType): Promise<{blog: OutputBlogType}> {
        try {
            const createdInfo = await blogMongoRepository.create(input)

            const foundInfo = await blogMongoQueryRepository.findForOutputById(new ObjectId(createdInfo.id))
            // if (!foundInfo.blog) {
            //     return { error: 'Blog not found after creation' }
            // }

            return {blog: foundInfo.blog} as { blog: OutputBlogType }
        } catch (err) {
            console.error(err)
            throw new Error("Failed to create blog")
        }
    },
    async deleteBlog(blogId: ObjectId): Promise<{ success?: boolean, error?: string }> {
        return blogMongoRepository.delete(blogId)
    },
    async updateBlog(blogId: ObjectId, input: InputBlogType): Promise<{ id?: string, error?: string }> {
        try {
            const updatedInfo = await blogMongoRepository.update(blogId, input)

            if (updatedInfo.error) {
                return {error: 'Blog not found'}
            }

            return {id: updatedInfo.id}
        } catch (err) {
            console.error(err)
            throw new Error("Error updating blog")
        }
        // return await blogMongoRepository.update(blogId, input)
    }
}