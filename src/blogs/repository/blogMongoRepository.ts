import {blogCollection, db, postCollection} from "../../db/mongo-db"
import {generateUniqueId} from "../../helpers/id-helper"
import {BlogDBType} from "../../db/db-types/blog-db-types";
import {InputBlogType} from "../../input-output-types/blog-types";
import {InsertOneResult, ObjectId} from "mongodb";

export const blogMongoRepository = {
    async find(): Promise<BlogDBType[]> {
        try {
            const posts: BlogDBType[] = await blogCollection.find({}).toArray()
            console.log(posts)
            return posts
        } catch (err) {
            throw new Error("Failed to get blogs")
        }
    },
    async findById(id: string) {
        try {
            const blog: BlogDBType | null = await blogCollection.findOne({_id: new ObjectId((id))})
            console.log(blog)
            return blog;
        } catch (err) {
            throw new Error ('Failed to get blog')
        }
    },
    async create(input: InputBlogType) {
        const newBlog = {
            ...input,
            _id: new ObjectId(),
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        try {
            const insertedInfo: InsertOneResult<BlogDBType> = await blogCollection.insertOne(newBlog)

            return {id: insertedInfo.insertedId.toString()}
        } catch (err) {
            throw new Error("Failed to create blog")
        }


        //return {id: newBlog.id}
    },
    // async update(id: string, input: InputBlogType): Promise<{ error?: string, id?: string }> {
    //     const blogIndex = db.blogs.findIndex((blog) => blog.id === id);
    //     if (blogIndex === -1) {
    //         return {error: 'Blog not found'}
    //     }
    //
    //     const existingBlog = db.blogs[blogIndex]
    //
    //     const updatedBlog = {
    //         ...existingBlog,
    //         ...input
    //     }
    //
    //     try {
    //         db.blogs[blogIndex] = updatedBlog;
    //     } catch (err) {
    //         return {error: 'Error updating blog'};
    //     }
    //
    //     return {id: updatedBlog.id};
    // },
    // async delete(id: string): Promise<{ error?: string, success?: boolean }> {
    //     const blogIndex = db.blogs.findIndex((blog) => blog.id === id)
    //     if (blogIndex === -1) {
    //         return {error: 'Blog not found'}
    //     }
    //
    //     try {
    //         db.blogs.splice(blogIndex, 1)
    //     } catch (err) {
    //         return {error: 'Error deleting blog'}
    //     }
    //
    //     return {success: true}
    // },
    async findAllForOutput() {
        const blogs: BlogDBType[] =  await this.find()
        console.log(blogs)
        return blogs.map((blog: BlogDBType) => this.mapToOutput(blog))
    },
    mapToOutput ({_id, ...rest}: BlogDBType) {
        return {
            ...rest,
            id: _id.toString()
        }
    }
}
