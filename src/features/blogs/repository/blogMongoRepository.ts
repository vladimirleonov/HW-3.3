import {db} from "../../../db/mongoose-db"
import {BlogDBType, BlogDocument} from "../../../db/db-types/blog-db-types"
import {BlogBodyInputType} from "../input-output-types/blog-types"
import {DeleteResult, ObjectId, UpdateResult} from "mongodb"

export const blogMongoRepository = {
    async save(blog: BlogDocument): Promise<BlogDocument> {
        return blog.save()
    },
    // async create(newBlog: BlogDBType): Promise<string> {
    //     const insertedInfo: InsertOneResult<BlogDBType> = await db.getCollections().blogCollection.insertOne(newBlog)
    //     return insertedInfo.insertedId.toString()
    // },
    async update(id: string, input: BlogBodyInputType): Promise<boolean> {
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


// export const blogMongoRepository = {
//     async create(newBlog: BlogDBType): Promise<string> {
//         const insertedInfo: InsertOneResult<BlogDBType> = await db.getCollections().blogCollection.insertOne(newBlog)
//         return insertedInfo.insertedId.toString()
//     },
//     async update(id: string, input: BlogBodyInputType): Promise<boolean> {
//         const updatedInfo: UpdateResult<BlogDBType> = await db.getCollections().blogCollection.updateOne(
//             {_id: new ObjectId(id)},
//             {$set: {...input}})
//
//         return updatedInfo.matchedCount === 1
//     },
//     async delete(id: string): Promise<boolean> {
//         const deletedInfo: DeleteResult = await db.getCollections().blogCollection.deleteOne({_id: new ObjectId(id)})
//         return deletedInfo.deletedCount === 1
//     },
//     async findById(id: string): Promise<BlogDBType | null> {
//         return db.getCollections().blogCollection.findOne({_id: new ObjectId(id)})
//     }
// }