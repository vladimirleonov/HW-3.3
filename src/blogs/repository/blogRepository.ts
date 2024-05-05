import {db} from "../../db/db"
import {generateUniqueId} from "../../helpers/id-helper"
import {BlogDBType} from "../../db/db-types/blog-db-types";
import {InputBlogType} from "../../input-output-types/blog-types";

export const blogRepository = {
    async find(): Promise<{ error?: string, blogs?: BlogDBType[] }> {
        try {
            const foundBlogs = db.blogs
            return {blogs: foundBlogs}
        } catch (err) {
            return {error: 'Failed to get blogs'}
        }
    },
    async findById(id: string): Promise<{ error?: string, blog?: BlogDBType }> {
        try {
            const foundBlog = db.blogs.find(blog => blog.id === id)
            return {blog: foundBlog}
        } catch (err) {
            return {error: 'Failed to get blog'}
        }
    },
    async create(input: InputBlogType): Promise<{ error?: string, id?: string }> {
        const newBlog = {
            ...input,
            id: generateUniqueId()
        }

        try {
            db.blogs = [...db.blogs, newBlog]
        } catch (err) {
            return {error: 'Failed to create blog'}
        }

        return {id: newBlog.id}
    },
    async update(id: string, input: InputBlogType): Promise<{ error?: string, id?: string }> {
        const blogIndex = db.blogs.findIndex((blog) => blog.id === id);
        if (blogIndex === -1) {
            return {error: 'Blog not found'}
        }

        const existingBlog = db.blogs[blogIndex]

        const updatedBlog = {
            ...existingBlog,
            ...input
        }

        try {
            db.blogs[blogIndex] = updatedBlog;
        } catch (err) {
            return {error: 'Error updating blog'};
        }

        return {id: updatedBlog.id};
    },
    async delete(id: string): Promise<{ error?: string, success?: boolean }> {
        const blogIndex = db.blogs.findIndex((blog) => blog.id === id)
        if (blogIndex === -1) {
            return {error: 'Blog not found'}
        }

        try {
            db.blogs.splice(blogIndex, 1)
        } catch (err) {
            return {error: 'Error deleting blog'}
        }

        return {success: true}
    },

    // async findForOutput(id: string) {
    //     return this.findById(id)
    // }

    // mapToOutput (blog: BlogDBType) {
    //     return {

    //     }
    // }
}
