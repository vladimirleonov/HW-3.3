import {db} from "../../../db/mongo-db"
import {BlogDBType} from "../../../db/db-types/blog-db-types"
import {InputBlogType} from "../input-output-types/blog-types"
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb"

export const blogMongoRepository = {
    async create(newBlog: BlogDBType): Promise<string> {
        const insertedInfo: InsertOneResult<BlogDBType> = await db.getCollections().blogCollection.insertOne(newBlog)
        return insertedInfo.insertedId.toString()
    },
    async update(id: string, input: InputBlogType): Promise<boolean> {
        const updatedInfo: UpdateResult<BlogDBType> = await db.getCollections().blogCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: {...input}})

        return updatedInfo.matchedCount === 1
    },
    async delete(id: string): Promise<boolean> {
        const deletedInfo: DeleteResult = await db.getCollections().blogCollection.deleteOne({_id: new ObjectId(id)})
        return deletedInfo.deletedCount === 1
    },
    async findById(id: string): Promise<BlogDBType | null> {
        return db.getCollections().blogCollection.findOne({_id: new ObjectId(id)})
    }
}
