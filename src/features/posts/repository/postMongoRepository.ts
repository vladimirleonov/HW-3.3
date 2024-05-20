import {PostDbType} from "../../../db/db-types/post-db-types"
import {InputBlogPostType, InputPostType} from "../../../input-output-types/post-types"
import {postCollection} from "../../../db/mongo-db"
import {InsertOneResult, ObjectId} from "mongodb"
import {BlogDBType} from "../../../db/db-types/blog-db-types"
import {blogMongoQueryRepository} from "../../blogs/repository/blogMongoQueryRepository";

export const postMongoRepository = {
    async create({blogId, ...restInput}: InputPostType): Promise<{ id?: string, error?: string }> {
        const blog: BlogDBType | null = await blogMongoQueryRepository.findById(new ObjectId(blogId))

        if (!blog) {
            return {error: 'Blog not found'}
        }

        const newPost: PostDbType = {
            _id: new ObjectId(),
            ...restInput,
            blogId: new ObjectId(blogId),
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        try {
            const insertedInfo: InsertOneResult<PostDbType> = await postCollection.insertOne(newPost)
            // if (!insertedInfo.acknowledged) {
            //     return {error: 'Insert operation was not acknowledged'}
            // }

            return {id: insertedInfo.insertedId.toString()}
        } catch (err) {
            throw new Error("Failed to create post")
        }
    },
    async createBlogPost(input: InputBlogPostType, blogId: ObjectId): Promise<{ id?: string, error?: string }> {
        const blog: BlogDBType | null = await blogMongoQueryRepository.findById(blogId)

        if (!blog) {
            return {error: 'Blog not found'}
        }

        const newPost: PostDbType = {
            _id: new ObjectId(),
            ...input,
            blogId: blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        try {
            const insertedInfo: InsertOneResult<PostDbType> = await postCollection.insertOne(newPost)

            return {id: insertedInfo.insertedId.toString()}
        } catch (err) {
            throw new Error("Failed to create post")
        }
    },
    async update(id: ObjectId, {blogId, ...restInput}: InputPostType): Promise<{ id?: string, error?: string }> {
        try {
            const updatedInfo = await postCollection.updateOne(
                {_id: id},
                {
                    $set: {
                        blogId: new ObjectId(blogId),
                        ...restInput
                    }
                }
            )

            if (updatedInfo.matchedCount === 0) {
                return {error: "Post not found"}
            }

            return {id: id.toString()}
        } catch (err) {
            throw new Error('Error updating post')
        }
    },
    async delete(id: ObjectId): Promise<{ success?: boolean, error?: string }> {
        try {
            const deletedInfo = await postCollection.deleteOne({_id: id})
            if (deletedInfo.deletedCount === 0) {
                return {error: "Post not found"}
            }

            return {success: true}
        } catch (err) {
            throw new Error('Error deleting post')
        }
    }
}