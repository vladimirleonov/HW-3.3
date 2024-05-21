import {blogMongoRepository} from "../repository/blogMongoRepository";
import {ObjectId} from "mongodb";
import {InputBlogType, OutputBlogType} from "../../../input-output-types/blog-types";
import {BlogDBType} from "../../../db/db-types/blog-db-types";

export const blogService = {
    async createBlog(input: InputBlogType): Promise<string> {
        try {
            const newBlog: BlogDBType = {
                _id: new ObjectId(),
                createdAt: new Date().toISOString(),
                isMembership: false,
                ...input,
            }
            const createdInfo = await blogMongoRepository.create(newBlog)
            return createdInfo.id
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