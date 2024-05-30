import {blogMongoRepository} from "../repository/blogMongoRepository";
import {ObjectId} from "mongodb";
import {InputBlogType} from "../input-output-types/blog-types";
import {BlogDBType} from "../../../db/db-types/blog-db-types";
import {Result, ResultStatus} from "../../../common/types/result-type";

export const blogService = {
    async createBlog(input: InputBlogType): Promise<Result<string>> {
        const newBlog: BlogDBType = {
            _id: new ObjectId(),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...input,
        }

        const createdId: string = await blogMongoRepository.create(newBlog)
        return {
            status: ResultStatus.Success,
            data: createdId
        }
    },
    async deleteBlog(blogId: string): Promise<Result<boolean>> {
        const isDeleted: boolean = await blogMongoRepository.delete(blogId);
        if (isDeleted) {
            return {
                status: ResultStatus.Success,
                data: true
            };
        } else {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'blogId', message: `Blog with id ${blogId} could not be found or deleted`}],
                data: false
            };
        }
    },
    async updateBlog(blogId: string, input: InputBlogType): Promise<Result<boolean>> {
        const isUpdated = await blogMongoRepository.update(blogId, input)
        if (isUpdated) {
            return {
                status: ResultStatus.Success,
                data: true
            }
        } else {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'blogId', message: `Blog with id ${blogId} could not be found or updated`}],
                data: false
            };
        }
    }
}