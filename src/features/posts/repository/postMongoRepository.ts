import {PostDbType} from "../../../db/db-types/post-db-types"
import {InputBlogPostType, InputPostType, OutputPostType} from "../../../input-output-types/post-types"
import {postCollection} from "../../../db/mongo-db"
import {InsertOneResult, ObjectId} from "mongodb"
import {blogMongoRepository} from "../../blogs/repository/blogMongoRepository"
import {BlogDBType} from "../../../db/db-types/blog-db-types"
import {blogMongoQueryRepository} from "../../blogs/repository/blogMongoQueryRepository";

export const postMongoRepository = {
    // async find(): Promise<PostDbType[]> {
    //     try {
    //         return await postCollection.find({}).toArray()
    //     } catch (err) {
    //         throw new Error("Failed to get posts")
    //     }
    // },
    // async findById(id: ObjectId): Promise<PostDbType | null> {
    //     try {
    //         return await postCollection.findOne({_id: id})
    //     } catch (err) {
    //         throw new Error("Failed to get post")
    //     }
    // },
    async create({blogId, ...restInput}: InputPostType): Promise<{ id?: string, error?: string }> {
        const blog: BlogDBType | null = await blogMongoQueryRepository.findById(new ObjectId(blogId))

        if (!blog) {
            return {error: 'Blog not found'}
        }

        const newPost: PostDbType = {
            _id: new ObjectId(),
            blogId: new ObjectId(blogId),
            ...restInput,
            createdAt: new Date().toISOString(),
            blogName: blog.name
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
    async createBlogPost (input: InputBlogPostType, blogId: ObjectId): Promise<{id?: string, error?: string}> {
        // console.log(input)
        // {
        //     title: 'titleqqq',
        //     shortDescription: 'shortDescriptionqqq',
        //     content: 'contentqqq'
        // }
        // console.log(blogId)
        // new ObjectId('664497ad06fe784da4e3c49d')
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

        const insertedInfo: InsertOneResult<PostDbType> = await postCollection.insertOne(newPost)

        return {id: insertedInfo.insertedId.toString()}
    },
    async update(id: ObjectId, {blogId, ...restInput}: InputPostType): Promise<{ id?: string, error?: string }> {
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
    },
    async delete(id: ObjectId) {
        try {
            const deletedInfo = await postCollection.deleteOne({_id: id})
            if (deletedInfo.deletedCount === 0) {
                return {error: "Post not found"}
            }

            return {success: true}
        } catch (err) {
            throw new Error('Error deleting post')
        }
    },
    // async findAllForOutput(): Promise<OutputPostType[]> {
    //     const posts: PostDbType[] = await this.find()
    //     return posts.map((post: PostDbType): OutputPostType => this.mapToOutput(post))
    // },
    // async findForOutputById(id: ObjectId): Promise<{ post?: OutputPostType, error?: string }> {
    //     const post: PostDbType | null = await this.findById(id)
    //     if (!post) {
    //         return {error: 'Post not found'}
    //     }
    //     return {post: this.mapToOutput(post)}
    // },
    // mapToOutput({_id, blogId, ...rest}: PostDbType): OutputPostType {
    //     return {
    //         id: _id.toString(),
    //         blogId: blogId.toString(),
    //         ...rest
    //     }
    // }
}