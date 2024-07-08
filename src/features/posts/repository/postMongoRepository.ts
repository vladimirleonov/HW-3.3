import {PostModel} from "../../../db/models/post.model"
import {PostBodyInputType} from "../input-output-types/post-types"
import {DeleteResult, ObjectId, UpdateResult} from "mongodb"
import {PostDbType, PostDocument} from "../../../db/db-types/post-db-types";

class PostMongoRepository {
    async save(post: PostDocument): Promise<PostDocument> {
        return post.save()
    }
    async update(id: string, {blogId, ...restInput}: PostBodyInputType): Promise<boolean> {
        const updatedInfo: UpdateResult<PostDbType> = await PostModel.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    blogId: new ObjectId(blogId),
                    ...restInput
                }
            }
        )

        return updatedInfo.matchedCount === 1
    }
    async delete(id: string): Promise<boolean> {
        const deletedInfo: DeleteResult = await PostModel.deleteOne({_id: new ObjectId(id)})
        return deletedInfo.deletedCount === 1
    }
    async findById(id: string): Promise<PostDbType | null> {
        if (!this.isValidObjectId(id)) return null
        return PostModel.findOne({_id: new ObjectId(id)})
    }
    isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}

export const postMongoRepository: PostMongoRepository = new PostMongoRepository()