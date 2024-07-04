import {PostModel} from "../../../db/models/post.model"
import {PostBodyInputType} from "../input-output-types/post-types"
import {DeleteResult, ObjectId, UpdateResult, WithId} from "mongodb"
import {PostDbType, PostDocument} from "../../../db/db-types/post-db-types";

export const postMongoRepository = {
    async save(post: PostDocument): Promise<PostDocument> {
        return post.save()
    },
    // async create(newPost: PostDbType): Promise<string> {
    //     const insertedInfo: InsertOneResult<PostDbType> = await db.getCollections().postCollection.insertOne(newPost)
    //     return insertedInfo.insertedId.toString()
    // },
    // async createBlogPost(newPost: PostDbType): Promise<string> {
    //     const insertedInfo: InsertOneResult<PostDbType> = await db.getCollections().postCollection.insertOne(newPost)
    //     return insertedInfo.insertedId.toString()
    // },
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
    },
    async delete(id: string): Promise<boolean> {
        const deletedInfo: DeleteResult = await PostModel.deleteOne({_id: new ObjectId(id)})
        return deletedInfo.deletedCount === 1
    },
    async findById(id: string): Promise<WithId<PostDbType> | null> {
        if (!this.isValidObjectId(id)) return null
        return await PostModel.findOne({_id: new ObjectId(id)}).lean()
    },
    isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}