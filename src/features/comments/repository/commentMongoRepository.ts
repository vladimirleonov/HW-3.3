import {CommentDbType} from "../../../db/db-types/comment-db-types";
import {db} from "../../../db/mongo-db";
import {InsertOneResult} from "mongodb";

export const commentMongoRepository = {
    async create(newComment: CommentDbType): Promise<string> {
        const insertedInfo: InsertOneResult<CommentDbType> = await db.getCollections().commentCollection.insertOne(newComment)
        return insertedInfo.insertedId.toString()
    }
}