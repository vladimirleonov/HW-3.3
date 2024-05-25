import {PostDbType} from "../../../db/db-types/post-db-types"
import {InputPostType} from "../input-output-types/post-types"
//import {db, postCollection} from "../../../db/mongo-db"
import {db} from "../../../db/mongo-db"
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb"

export const postMongoRepository = {
    async create(newPost: PostDbType): Promise<string> {
        const insertedInfo: InsertOneResult<PostDbType> = await db.getCollections().postCollection.insertOne(newPost)
        return insertedInfo.insertedId.toString()
    },
    async createBlogPost(newPost: PostDbType): Promise<string> {
        const insertedInfo: InsertOneResult<PostDbType> = await db.getCollections().postCollection.insertOne(newPost)
        return insertedInfo.insertedId.toString()
    },
    async update(id: string, {blogId, ...restInput}: InputPostType): Promise<boolean> {
        const updatedInfo: UpdateResult<PostDbType> = await db.getCollections().postCollection.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    blogId: new ObjectId(blogId),
                    ...restInput
                }
            }
        )

        // if (updatedInfo.matchedCount === 0) {
        //     return {error: "Post not found"}
        // }
        //
        // return {id: id.toString()}

        return updatedInfo.matchedCount === 1
    },
    async delete(id: string): Promise<boolean> {
        const deletedInfo: DeleteResult = await db.getCollections().postCollection.deleteOne({_id: new ObjectId(id)})
        return deletedInfo.deletedCount === 1
    },
    async findById(id: ObjectId): Promise<PostDbType | null> {
        return await db.getCollections().postCollection.findOne({_id: id})
    }
}