import {CommentModel} from "../../../db/models/comment.model"
import {DeleteResult, ObjectId, UpdateResult} from "mongodb"
import {CommentBodyInputType} from "../input-output-types/comment-types"
import {CommentDbType, CommentDocument} from "../../../db/db-types/comment-db-types";

export const commentMongoRepository = {
    async save(comment: CommentDocument): Promise<CommentDocument> {
        return comment.save()
    },
    async findById(id: string): Promise<CommentDocument | null> {
        if (!this.isValidObjectId(id)) return null
        return CommentModel.findOne({_id: new ObjectId(id)})
    },
    async update(id: string, {content}: CommentBodyInputType): Promise<boolean> {
        const updatedInfo: UpdateResult<CommentDbType> = await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: {content}})
        return updatedInfo.matchedCount === 1
    },
    async deleteOne(id: string): Promise<boolean> {
        const deletedIndo: DeleteResult = await CommentModel.deleteOne({_id: new ObjectId(id)})
        return deletedIndo.deletedCount === 1
    },
    async deleteMany(postId: string): Promise<number> {
        const deletedInfo: DeleteResult = await CommentModel.deleteMany({postId: new ObjectId(postId)})
        return deletedInfo.deletedCount
    },
    isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}