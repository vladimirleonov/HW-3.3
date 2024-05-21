import {blogMongoRepository} from "../repository/blogMongoRepository";
import {ObjectId} from "mongodb";
import {InputBlogType} from "../../../input-output-types/blog-types";
import {BlogDBType} from "../../../db/db-types/blog-db-types";

export const blogService = {
    async createBlog(input: InputBlogType): Promise<string> {
        const newBlog: BlogDBType = {
            _id: new ObjectId(),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...input,
        }

        return await blogMongoRepository.create(newBlog)
    },
    async deleteBlog(blogId: string) {
        return blogMongoRepository.delete(blogId)
    },
    async updateBlog(blogId: string, input: InputBlogType) {
        return blogMongoRepository.update(blogId, input)
    }
}