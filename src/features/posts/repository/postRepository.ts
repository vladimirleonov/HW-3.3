import {db} from "../../../db/db"
import {PostDbType} from "../../../db/db-types/post-db-types"
import {generateUniqueId} from "../../../helpers/id-helper";
import {blogRepository} from "../../blogs/repository/blogRepository";
import {InputPostType} from "../../../input-output-types/post-types";

export const postRepository = {
    // async find(): Promise<{ error?: string, posts?: PostDbType[] }> {
    //     try {
    //         const foundPosts = db.posts;
    //         return {posts: foundPosts}
    //     } catch (err) {
    //         return {error: 'Failed to get posts'}
    //     }
    // },
    // async findById(id: string): Promise<{ error?: string, post?: PostDbType }> {
    //     try {
    //         return {post: db.posts.find((post) => post.id === id)};
    //     } catch (err) {
    //         return {error: 'Failed to get post'}
    //     }
    // },
    // async create(input: InputPostType): Promise<{ error?: string, id?: string }> {
    //     const blogInfo = await blogRepository.findById(input.blogId)
    //     if (!blogInfo || !blogInfo.blog) {
    //         return {error: 'Blog not found'}
    //     }
    //
    //     const newPost: PostDbType = {
    //         id: generateUniqueId(),
    //         blogName: blogInfo.blog.name,
    //         ...input
    //     }
    //
    //     try {
    //         db.posts = [...db.posts, newPost]
    //     } catch (err) {
    //         return {error: 'Failed to create post'}
    //     }
    //
    //     return {id: newPost.id}
    // },
    // async delete(id: string): Promise<{ error?: string, success?: boolean }> {
    //     const postIndex = db.posts.findIndex((post: PostDbType) => post.id === id)
    //
    //     if (postIndex === -1) {
    //         return {error: 'Post not found'}
    //     }
    //
    //     try {
    //         db.posts.splice(postIndex, 1)
    //     } catch (err) {
    //         return {error: 'Failed to delete post'}
    //     }
    //
    //     return {success: true}
    // },
    // async update(id: string, input: InputPostType): Promise<{ error?: string, id?: string }> {
    //     const postIndex = db.posts.findIndex(post => post.id === id)
    //     if (postIndex === -1) {
    //         return {error: 'Post not found'}
    //     }
    //
    //     const existingPost = db.posts[postIndex];
    //
    //     const updatedPost = {
    //         ...existingPost,
    //         ...input
    //     }
    //
    //     try {
    //         db.posts[postIndex] = updatedPost;
    //     } catch (err) {
    //         return {error: 'Failed to update post'}
    //     }
    //
    //     return {id: updatedPost.id}
    // },
    // async findForOutput(id: string) {
    //     return this.findById(id)
    // }

    // mapToOutput (post: PostDBType) {
    //     return {

    //     }
    // }
}