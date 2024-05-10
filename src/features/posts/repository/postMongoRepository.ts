import {PostDbType} from "../../../db/db-types/post-db-types";
import {InputPostType, OutputPostType} from "../../../input-output-types/post-types";
import {postCollection} from "../../../db/mongo-db";
import {InsertOneResult, ObjectId} from "mongodb";
import {blogMongoRepository} from "../../blogs/repository/blogMongoRepository";
import {BlogDBType} from "../../../db/db-types/blog-db-types";

export const postMongoRepository = {
    async find(): Promise<PostDbType[]> {
        try {
            return await postCollection.find({}).toArray()
        } catch (err) {
            throw new Error("Failed to get posts")
        }
    },
    async findById(id: ObjectId): Promise<PostDbType | null> {
        try {
            return await postCollection.findOne({_id: id})
        } catch (err) {
            throw new Error("Failed to get post")
        }
    },
    async create (input: InputPostType): Promise<{id?: string, error?: string}> {
        const blog: BlogDBType | null = await blogMongoRepository.findById(new ObjectId(input.blogId))

        if (!blog) {
            return {error: 'Blog not found'}
        }

        const newPost: PostDbType = {
            _id: new ObjectId(),
            ...input,
            createdAt: new Date().toISOString(),
            blogName: blog.name
        }

        try {
            const insertedInfo: InsertOneResult<PostDbType> = await postCollection.insertOne(newPost)
            if (!insertedInfo.acknowledged) {
                return {error: 'Insert operation was not acknowledged'}
            }

            return { id: insertedInfo.insertedId.toString() }
        } catch (err) {
            throw new Error("Failed to create post")
        }
    },
    async update(id: ObjectId, input: InputPostType): Promise<{id?: string, error?: string}> {
        const updatedInfo = await postCollection.updateOne(
            {_id: id},
            {$set: {...input}}
        )

        if (updatedInfo.matchedCount === 0) {
            return { error: "Post not found" }
        }

        return {id: id.toString()}
    },
    async delete(id: ObjectId) {
        try {
            const deletedInfo = await postCollection.deleteOne({_id: id});
            if (deletedInfo.deletedCount === 0) {
                return { error: "Post not found" }
            }

            return { success: true }
        } catch (err) {
            throw new Error ('Error deleting post')
        }
    },
    async findAllForOutput(): Promise<OutputPostType[]> {
        const posts: PostDbType[] = await this.find()
        return posts.map((post: PostDbType): OutputPostType => this.mapToOutput(post))
    },
    async findForOutputById(id: ObjectId): Promise<{post?: OutputPostType, error?: string}> {
        const post: PostDbType | null = await this.findById(id)
        if(!post) {
            return {error: 'Post not found'}
        }
        return {post: this.mapToOutput(post)}
    },
    mapToOutput({_id, ...rest} : PostDbType): OutputPostType {
        return {
            id: _id.toString(),
            ...rest
        }
    }
}