import {blogMongoRepository} from "../repository/blogMongoRepository"
import {BlogBodyInputType} from "../input-output-types/blog-types"
import {BlogModel} from "../../../db/models/blog.model"
import {Result, ResultStatus} from "../../../common/types/result"
import {BlogDBType, BlogDocument} from "../../../db/db-types/blog-db-types";
import {ObjectId} from "mongodb";

class BlogService {
    async createBlog(input: BlogBodyInputType): Promise<Result<string>> {

        const blogData: BlogDBType = new BlogDBType(
            new ObjectId(),
            input.name,
            input.description,
            input.websiteUrl,
            new Date().toISOString(),
            false,
        )

        const blogDocument: BlogDocument = new BlogModel(blogData)

        const createdBlog: BlogDocument = await blogMongoRepository.save(blogDocument)

        return {
            status: ResultStatus.Success,
            data: createdBlog._id.toString()
        }
    }
    async deleteBlog(blogId: string): Promise<Result<boolean>> {
        const isDeleted: boolean = await blogMongoRepository.delete(blogId)
        if (isDeleted) {
            return {
                status: ResultStatus.Success,
                data: true
            }
        } else {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'blogId', message: `Blog with id ${blogId} could not be found or deleted`}],
                data: false
            }
        }
    }
    async updateBlog(blogId: string, input: BlogBodyInputType): Promise<Result<boolean>> {
        const isUpdated: boolean = await blogMongoRepository.update(blogId, input)
        if (isUpdated) {
            return {
                status: ResultStatus.Success,
                data: true
            }
        } else {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'blogId', message: `Blog with id ${blogId} could not be found or updated`}],
                data: false
            }
        }
    }
}

export const blogService: BlogService = new BlogService()





// export const blogService = {
//     async createBlog(input: BlogBodyInputType): Promise<Result<string>> {
//
//         const newBlogData: BlogDBType = new BlogDBType(
//             new ObjectId().toString(),
//             input.description,
//             input.websiteUrl,
//             new Date().toISOString(),
//             false,
//         )
//
//         const newBlog: BlogDocument = new BlogModel(newBlogData)
//
//         const createdBlog: BlogDocument = await blogMongoRepository.save(newBlog)
//
//         return {
//             status: ResultStatus.Success,
//             data: createdBlog._id.toString()
//         }
//     },
//     async deleteBlog(blogId: string): Promise<Result<boolean>> {
//         const isDeleted: boolean = await blogMongoRepository.delete(blogId)
//         if (isDeleted) {
//             return {
//                 status: ResultStatus.Success,
//                 data: true
//             }
//         } else {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'blogId', message: `Blog with id ${blogId} could not be found or deleted`}],
//                 data: false
//             }
//         }
//     },
//     async updateBlog(blogId: string, input: BlogBodyInputType): Promise<Result<boolean>> {
//         const isUpdated: boolean = await blogMongoRepository.update(blogId, input)
//         if (isUpdated) {
//             return {
//                 status: ResultStatus.Success,
//                 data: true
//             }
//         } else {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'blogId', message: `Blog with id ${blogId} could not be found or updated`}],
//                 data: false
//             }
//         }
//     }
// }







// import {blogMongoRepository} from "../repository/blogMongoRepository"
// import {ObjectId} from "mongodb"
// import {BlogBodyInputType} from "../input-output-types/blog-types"
// import {BlogDBType} from "../../../db/db-types/blog-db-types"
// import {Result, ResultStatus} from "../../../common/types/result"
//
// export const blogService = {
    // async createBlog(input: BlogBodyInputType): Promise<Result<string>> {
    //     const newBlog: BlogDBType = {
    //         _id: new ObjectId(),
    //         createdAt: new Date().toISOString(),
    //         isMembership: false,
    //         ...input,
    //     }

    //     const createdId: string = await blogMongoRepository.create(newBlog)
    //     return {
    //         status: ResultStatus.Success,
    //         data: createdId
    //     }
    // },
//     async deleteBlog(blogId: string): Promise<Result<boolean>> {
//         const isDeleted: boolean = await blogMongoRepository.delete(blogId)
//         if (isDeleted) {
//             return {
//                 status: ResultStatus.Success,
//                 data: true
//             }
//         } else {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'blogId', message: `Blog with id ${blogId} could not be found or deleted`}],
//                 data: false
//             }
//         }
//     },
//     async updateBlog(blogId: string, input: BlogBodyInputType): Promise<Result<boolean>> {
//         const isUpdated = await blogMongoRepository.update(blogId, input)
//         if (isUpdated) {
//             return {
//                 status: ResultStatus.Success,
//                 data: true
//             }
//         } else {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'blogId', message: `Blog with id ${blogId} could not be found or updated`}],
//                 data: false
//             }
//         }
//     }
// }