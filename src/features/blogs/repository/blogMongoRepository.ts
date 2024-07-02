import {BlogDBType, BlogDocument, BlogModel} from "../../../db/models/blog.model"
import {BlogBodyInputType} from "../input-output-types/blog-types"
import {DeleteResult, ObjectId, UpdateResult, WithId} from "mongodb"

export const blogMongoRepository = {
    async save(blog: BlogDocument): Promise<BlogDocument> {
        return blog.save()
    },
    async update(id: string, input: BlogBodyInputType): Promise<boolean> {
        const updatedInfo: UpdateResult<BlogDBType> = await BlogModel.updateOne(
            {_id: new ObjectId(id)},
            {$set: {...input}})

        return updatedInfo.matchedCount === 1
    },
    async delete(id: string): Promise<boolean> {
        const deletedInfo: DeleteResult = await BlogModel.deleteOne({_id: new ObjectId(id)})
        return deletedInfo.deletedCount === 1
    },
    async findById(id: string): Promise<WithId<BlogDocument> | null> {
        return BlogModel.findOne({_id: new ObjectId(id)}).lean()
    }
}


// export const blogMongoRepository = {
//     async create(newBlog: BlogDBType): Promise<string> {
//         const insertedInfo: InsertOneResult<BlogDBType> = await BlogModel.insertOne(newBlog)
//         return insertedInfo.insertedId.toString()
//     },
//     async update(id: string, input: BlogBodyInputType): Promise<boolean> {
//         const updatedInfo: UpdateResult<BlogDBType> = await BlogModel.updateOne(
//             {_id: new ObjectId(id)},
//             {$set: {...input}})
//
//         return updatedInfo.matchedCount === 1
//     },
//     async delete(id: string): Promise<boolean> {
//         const deletedInfo: DeleteResult = await BlogModel.deleteOne({_id: new ObjectId(id)})
//         return deletedInfo.deletedCount === 1
//     },
//     async findById(id: string): Promise<BlogDBType | null> {
//         return BlogModel.findOne({_id: new ObjectId(id)})
//     }
// }