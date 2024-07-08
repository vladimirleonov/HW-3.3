import {postMongoRepository} from "../repository/postMongoRepository"
import {ObjectId} from "mongodb"
import {BlogPostInputType, PostBodyInputType} from "../input-output-types/post-types"
import {PostModel} from "../../../db/models/post.model"
import {blogMongoRepository} from "../../blogs/repository/blogMongoRepository"
import {Result, ResultStatus} from "../../../common/types/result"
import {commentMongoRepository} from "../../comments/repository/commentMongoRepository"
import { WithId } from "mongodb"
import {BlogDBType, BlogDocument} from "../../../db/db-types/blog-db-types";
import {PostDocument} from "../../../db/db-types/post-db-types";

export const postService = {
    async createPost({blogId, ...restInput}: PostBodyInputType): Promise<Result<string | null>> {
        const blog: WithId<BlogDBType> | null = await blogMongoRepository.findById(blogId)
        if (!blog) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'blogId', message: `Blog with id ${blogId} not found`}],
                data: null
            }
        }

        const newPost: PostDocument = new PostModel({
            _id: new ObjectId(),
            ...restInput,
            blogId: new ObjectId(blogId),
            blogName: blog.name,
            createdAt: new Date().toISOString()
        })

        const createdPost: PostDocument = await postMongoRepository.save(newPost)
        //const createdPostId: string = await postMongoRepository.create(newPost)

        return {
            status: ResultStatus.Success,
            data: createdPost._id.toString()
        }
    },
    async createBlogPost(input: BlogPostInputType, blogId: string): Promise<Result<string | null>> {
        const blog: BlogDocument | null = await blogMongoRepository.findById(blogId)
        if (!blog) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'blogId', message: `Blog with id ${blogId} not found`}],
                data: null
            }
        }

        const newPost: PostDocument = new PostModel({
            _id: new ObjectId(),
            ...input,
            blogId: new ObjectId(blogId),
            blogName: blog.name,
            createdAt: new Date().toISOString()
        })

        const createdPost: PostDocument = await postMongoRepository.save(newPost)
        //const createdBlogId: string = await postMongoRepository.createBlogPost(newPost)

        return {
            status: ResultStatus.Success,
            data: createdPost._id.toString()
        }
    },
    async deletePost(postId: string): Promise<Result<boolean | null>> {
        const isDeleted: boolean = await postMongoRepository.delete(postId)
        if (!isDeleted) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'postId', message: `Post with id ${postId} not found`}],
                data: null
            }
        } else {
            await commentMongoRepository.deleteMany(postId)

            return {
                status: ResultStatus.Success,
                data: isDeleted
            }
        }
    },
    async updatePost(postId: string, input: PostBodyInputType): Promise<Result<boolean | null>> {
        const isUpdated: boolean = await postMongoRepository.update(postId, input)
        if (!isUpdated) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'postId', message: `Post with id ${postId} not found`}],
                data: null
            }
        } else {
            return {
                status: ResultStatus.Success,
                data: isUpdated
            }
        }
    }
}


// export const postService = {
//     async createPost({blogId, ...restInput}: PostBodyInputType): Promise<Result<string | null>> {
//         const blog: WithId<BlogDBType> | null = await blogMongoRepository.findById(blogId)
//         if (!blog) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'blogId', message: `Blog with id ${blogId} not found`}],
//                 data: null
//             }
//         }
//
//         const newPost: PostDocument = new PostModel({
//             _id: new ObjectId(),
//             ...restInput,
//             blogId: new ObjectId(blogId),
//             blogName: blog.name,
//             createdAt: new Date().toISOString()
//         })
//
//         const createdPost: PostDocument = await postMongoRepository.save(newPost)
//         //const createdPostId: string = await postMongoRepository.create(newPost)
//
//         return {
//             status: ResultStatus.Success,
//             data: createdPost._id.toString()
//         }
//     },
//     async createBlogPost(input: BlogPostInputType, blogId: string): Promise<Result<string | null>> {
//         const blog: BlogDocument | null = await blogMongoRepository.findById(blogId)
//         if (!blog) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'blogId', message: `Blog with id ${blogId} not found`}],
//                 data: null
//             }
//         }
//
//         const newPost: PostDocument = new PostModel({
//             _id: new ObjectId(),
//             ...input,
//             blogId: new ObjectId(blogId),
//             blogName: blog.name,
//             createdAt: new Date().toISOString()
//         })
//
//         const createdPost: PostDocument = await postMongoRepository.save(newPost)
//         //const createdBlogId: string = await postMongoRepository.createBlogPost(newPost)
//
//         return {
//             status: ResultStatus.Success,
//             data: createdPost._id.toString()
//         }
//     },
//     async deletePost(postId: string): Promise<Result<boolean | null>> {
//         const isDeleted: boolean = await postMongoRepository.delete(postId)
//         if (!isDeleted) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'postId', message: `Post with id ${postId} not found`}],
//                 data: null
//             }
//         } else {
//             await commentMongoRepository.deleteMany(postId)
//
//             return {
//                 status: ResultStatus.Success,
//                 data: isDeleted
//             }
//         }
//     },
//     async updatePost(postId: string, input: PostBodyInputType): Promise<Result<boolean | null>> {
//         const isUpdated: boolean = await postMongoRepository.update(postId, input)
//         if (!isUpdated) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'postId', message: `Post with id ${postId} not found`}],
//                 data: null
//             }
//         } else {
//             return {
//                 status: ResultStatus.Success,
//                 data: isUpdated
//             }
//         }
//     }
// }





// export const postService = {
//     async createPost({blogId, ...restInput}: PostBodyInputType): Promise<Result<string | null>> {
//         const blog: BlogDBType | null = await blogMongoRepository.findById(blogId)
//         if (!blog) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'blogId', message: `Blog with id ${blogId} not found`}],
//                 data: null
//             }
//         }

//         const newPost: PostDbType = {
//             _id: new ObjectId(),
//             ...restInput,
//             blogId: new ObjectId(blogId),
//             blogName: blog.name,
//             createdAt: new Date().toISOString()
//         }

//         const createdPostId: string = await postMongoRepository.create(newPost)

//         return {
//             status: ResultStatus.Success,
//             data: createdPostId
//         }
//     },
//     async createBlogPost(input: BlogPostInputType, blogId: string): Promise<Result<string | null>> {
//         const blog: BlogDBType | null = await blogMongoRepository.findById(blogId)
//         if (!blog) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'blogId', message: `Blog with id ${blogId} not found`}],
//                 data: null
//             }
//         }

//         const newPost: PostDbType = {
//             _id: new ObjectId(),
//             ...input,
//             blogId: new ObjectId(blogId),
//             blogName: blog.name,
//             createdAt: new Date().toISOString()
//         }

//         const createdBlogId: string = await postMongoRepository.createBlogPost(newPost)

//         return {
//             status: ResultStatus.Success,
//             data: createdBlogId
//         }
//     },
//     async deletePost(postId: string): Promise<Result<boolean | null>> {
//         const isDeleted: boolean = await postMongoRepository.delete(postId)
//         if (!isDeleted) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'postId', message: `Post with id ${postId} not found`}],
//                 data: null
//             }
//         } else {
//             await commentMongoRepository.deleteMany(postId)

//             return {
//                 status: ResultStatus.Success,
//                 data: isDeleted
//             }
//         }
//     },
//     async updatePost(postId: string, input: PostBodyInputType): Promise<Result<boolean | null>> {
//         const isUpdated: boolean = await postMongoRepository.update(postId, input)
//         if (!isUpdated) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'postId', message: `Post with id ${postId} not found`}],
//                 data: null
//             }
//         } else {
//             return {
//                 status: ResultStatus.Success,
//                 data: isUpdated
//             }
//         }
//     }
// }