import {blogCollection} from "../../../db/mongo-db"
import {BlogDBType} from "../../../db/db-types/blog-db-types";
import {InputBlogType, OutputBlogType} from "../../../input-output-types/blog-types";
import {InsertOneResult, ObjectId} from "mongodb";

export const blogMongoRepository = {
    async find(): Promise<BlogDBType[]>
    {
        try {
            return await blogCollection.find({}).toArray()
        } catch (err) {
            throw new Error("Failed to get blogs")
        }
    },
    async findById(id: ObjectId): Promise<BlogDBType | null> {
        try {
            return await blogCollection.findOne({_id: new ObjectId((id))})
        } catch (err) {
            throw new Error ('Failed to get blog')
        }
    },
    async create(input: InputBlogType): Promise<{id?: string, error?: string}> {
        const newBlog = {
            _id: new ObjectId(),
            ...input,
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        try {
            const insertedInfo: InsertOneResult<BlogDBType> = await blogCollection.insertOne(newBlog)
            console.log(insertedInfo)

            if (!insertedInfo.acknowledged) {
                return {error: 'Insert operation was not acknowledged'}
            }

            return {id: insertedInfo.insertedId.toString()}
        } catch (err) {
            throw new Error("Failed to create blog")
        }
    },
    async update(id: ObjectId, input: InputBlogType) {
        try {
            const updatedInfo = await blogCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set: {...input}})

            if (updatedInfo.matchedCount === 0) {
                return {error: 'Blog not found'}
            }

            return {id: id.toString()};
        } catch (err) {
            throw new Error('Error updating blog')
        }
    },
    async delete(id: string)
    {
        //: Promise<{ error?: string, success?: boolean }>
        // const blogIndex = db.blogs.findIndex((blog) => blog.id === id)
        // if (blogIndex === -1) {
        //     return {error: 'Blog not found'}
        // }
        //
        // try {
        //     db.blogs.splice(blogIndex, 1)
        // } catch (err) {
        //     return {error: 'Error deleting blog'}
        // }
        //
        // return {success: true}
    },
    async findAllForOutput() {
        const blogs: BlogDBType[] = await this.find()
        return blogs.map((blog: BlogDBType): OutputBlogType => this.mapToOutput(blog))
    },
    async findForOutputById(id: ObjectId) {
      const blog: BlogDBType | null = await this.findById(id)
        if (!blog) {
            return {error: 'Blog not found'}
        }
      return {blog: this.mapToOutput(blog)}
    },
    mapToOutput ({_id, ...rest}: BlogDBType): OutputBlogType {
        return {
            ...rest,
            id: _id.toString()
        }
    }
}
