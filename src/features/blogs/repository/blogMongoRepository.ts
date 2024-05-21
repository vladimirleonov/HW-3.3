import {blogCollection} from "../../../db/mongo-db"
import {BlogDBType} from "../../../db/db-types/blog-db-types"
import {InputBlogType} from "../../../input-output-types/blog-types"
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb"

export const blogMongoRepository = {
    async create(newBlog: BlogDBType): Promise<{id: string}> {
        try {
            const insertedInfo: InsertOneResult<BlogDBType> = await blogCollection.insertOne(newBlog)
            // if (!insertedInfo.acknowledged) {
            //     return {error: 'Insert operation was not acknowledged'}
            // }

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
    }
}
