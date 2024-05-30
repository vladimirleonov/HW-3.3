import {CommentDbType} from "../../../db/db-types/comment-db-types";
import {db} from "../../../db/mongo-db";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {CommentInputType} from "../input-output-types/comment-types";

export const commentMongoRepository = {
    async findById(id: string): Promise<CommentDbType | null> {
        if(!this.isValidObjectId(id)) return null
        return db.getCollections().commentCollection.findOne({_id: new ObjectId(id)})
    },
    async create(newComment: CommentDbType): Promise<string> {
        const insertedInfo: InsertOneResult = await db.getCollections().commentCollection.insertOne(newComment)
        return insertedInfo.insertedId.toString()
    },
    async update(id: string, {content}: CommentInputType): Promise<boolean> {
        const updatedInfo: UpdateResult<CommentDbType> = await db.getCollections().commentCollection.updateOne({_id: new ObjectId(id)}, {$set: {content}})
        return updatedInfo.matchedCount === 1
    },
    async delete(id: string): Promise<boolean> {
        const deletedIndo: DeleteResult = await db.getCollections().commentCollection.deleteOne({ _id: new ObjectId(id) })
        return deletedIndo.deletedCount === 1
    },
    isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}