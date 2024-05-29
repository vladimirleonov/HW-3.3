import {db} from "../../../db/mongo-db";
import {CommentDbType} from "../../../db/db-types/comment-db-types";
import {CommentOutputType} from "../input-output-types/comment-types";
import {ObjectId} from "mongodb";

export const commentMongoQueryRepository = {
    async findForOutputById (id: string): Promise<CommentOutputType | null> {
        if(!this.isValidObjectId(id)) {
            return null
        }
        const comment: CommentDbType | null = await db.getCollections().commentCollection.findOne({_id: new ObjectId(id)})
        if (!comment) {
            return null
        }

        return this.mapToOutput(comment)
    },
    mapToOutput({_id, ...rest}: CommentDbType): CommentOutputType {
        return {
            id: _id.toString(),
            ...rest
        }
    },
    isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}