import {blogCollection} from "../../../db/mongo-db"
import {BlogDBType} from "../../../db/db-types/blog-db-types"
import {InputBlogType, OutputBlogType} from "../../../input-output-types/blog-types"
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb"
import {QueryParamsType} from "../../../input-output-types/common-types";

export const blogMongoRepository = {

    // async find(): Promise<BlogDBType[]> {
    //     try {
    //         return await blogCollection.find({}).toArray()
    //     } catch (err) {
    //         throw new Error("Failed to get blogs")
    //     }
    // },
    // async findById(id: ObjectId): Promise<BlogDBType | null> {
    //     try {
    //         return await blogCollection.findOne({_id: id})
    //     } catch (err) {
    //         throw new Error('Failed to get blog')
    //     }
    // },
    async create(input: InputBlogType): Promise<{ id?: string, error?: string }> {
        const newBlog: BlogDBType = {
            _id: new ObjectId(),
            createdAt: new Date().toISOString(),
            isMembership: false,
            ...input,
        }

        try {
            const insertedInfo: InsertOneResult<BlogDBType> = await blogCollection.insertOne(newBlog)

            if (!insertedInfo.acknowledged) {
                return {error: 'Insert operation was not acknowledged'}
            }

            return {id: insertedInfo.insertedId.toString()}
        } catch (err) {
            throw new Error("Failed to create blog")
        }
    },
    async update(id: ObjectId, input: InputBlogType): Promise<{ id?: string, error?: string }> {
        try {
            const updatedInfo: UpdateResult<BlogDBType> = await blogCollection.updateOne(
                {_id: id},
                {$set: {...input}})

            if (updatedInfo.matchedCount === 0) {
                return {error: 'Blog not found'}
            }

            return {id: id.toString()}
        } catch (err) {
            throw new Error('Error updating blog')
        }
    },
    async delete(id: ObjectId): Promise<{ success?: boolean, error?: string }> {
        try {
            const deletedInfo: DeleteResult = await blogCollection.deleteOne({_id: id})

            if (deletedInfo.deletedCount === 0) {
                return {error: 'Blog not found'}
            }

            return {success: true}
        } catch (err) {
            throw new Error('Error deleting blog')
        }
    },
    // async findAllForOutput(queryParams: QueryParamsType): Promise<OutputBlogType[]> {
    //     const blogs: BlogDBType[] = await this.find()
    //     return blogs.map((blog: BlogDBType): OutputBlogType => this.mapToOutput(blog))
    // },
    // async findForOutputById(id: ObjectId): Promise<{ blog?: OutputBlogType, error?: string }> {
    //     const blog: BlogDBType | null = await this.findById(id)
    //     if (!blog) {
    //         return {error: 'Blog not found'}
    //     }
    //     return {blog: this.mapToOutput(blog)}
    // },
    // mapToOutput({_id, ...rest}: BlogDBType): OutputBlogType {
    //     return {
    //         ...rest,
    //         id: _id.toString()
    //     }
    // }
}
