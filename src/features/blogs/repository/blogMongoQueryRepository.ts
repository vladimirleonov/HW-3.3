import {db} from "../../../db/mongoose-db-connection"
import {BlogDBType} from "../../../db/db-types/blog-db-types"
import {BlogsPaginationOutputType, BlogOutputType} from "../input-output-types/blog-types"
import {ObjectId} from "mongodb"
import {SanitizedBlogsQueryParamsType} from "../helpers/sanitizeBlogsQueryParams"

export const blogMongoQueryRepository = {
    async findAllForOutput(query: SanitizedBlogsQueryParamsType): Promise<BlogsPaginationOutputType> {
        const searchFilter = query.searchNameTerm
            ? {name: {$regex: query.searchNameTerm, $options: 'i'}}
            : {}

        const filter = {
            ...searchFilter
        }

        const blogs: BlogDBType[] = await db.getCollections().blogCollection
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean()
            .exec()
        
        const totalCount: number = await db.getCollections().blogCollection.countDocuments(filter)

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: blogs.map((blog: BlogDBType) => this.mapToOutput(blog))
        }
    },
    async findForOutputById(id: string): Promise<BlogOutputType | null> {
        const blog: BlogDBType | null = await db.getCollections().blogCollection.findOne({_id: new ObjectId(id)})
        return blog ? this.mapToOutput(blog) : null
    },
    mapToOutput({_id, name, description, websiteUrl, createdAt, isMembership, ...rest}: BlogDBType): BlogOutputType {
        return {
            id: _id.toString(),
            name,
            description,
            websiteUrl,
            createdAt,
            isMembership
        }
    }
}




// import {db} from "../../../db/mongoose-db"
// import {BlogDBType} from "../../../db/db-types/blog-db-types"
// import {BlogsPaginationOutputType, BlogOutputType} from "../input-output-types/blog-types"
// import {ObjectId} from "mongodb"
// import {SanitizedBlogsQueryParamsType} from "../helpers/sanitizeBlogsQueryParams"

// export const blogMongoQueryRepository = {
//     async findAllForOutput(query: SanitizedBlogsQueryParamsType): Promise<BlogsPaginationOutputType> {
//         const searchFilter = query.searchNameTerm
//             ? {name: {$regex: query.searchNameTerm, $options: 'i'}}
//             : {}

//         const filter = {
//             ...searchFilter
//         }

//         const blogs: BlogDBType[] = await db.getCollections().blogCollection
//             .find(filter)
//             .sort(query.sortBy, query.sortDirection)
//             .skip((query.pageNumber - 1) * query.pageSize)
//             .limit(query.pageSize)
//             .toArray()

//         const totalCount: number = await db.getCollections().blogCollection.countDocuments(filter)

//         return {
//             pagesCount: Math.ceil(totalCount / query.pageSize),
//             page: query.pageNumber,
//             pageSize: query.pageSize,
//             totalCount,
//             items: blogs.map((blog: BlogDBType) => this.mapToOutput(blog))
//         }
//     },
//     // async findForOutputById(id: string): Promise<{error?: string, blog?: OutputBlogType}> {
//     //     const blog: BlogDBType | null = await db.getCollections().blogCollection.findOne({_id: new ObjectId(id)})
//     //     if (!blog) {
//     //         return {error: 'Post not found'}
//     //     }
//     //     return {blog: this.mapToOutput(blog)}
//     // },
//     async findForOutputById(id: string): Promise<BlogOutputType | null> {
//         const blog: BlogDBType | null = await db.getCollections().blogCollection.findOne({_id: new ObjectId(id)})
//         return blog ? this.mapToOutput(blog) : null
//     },
//     mapToOutput({_id, ...rest}: BlogDBType): BlogOutputType {
//         return {
//             ...rest,
//             id: _id.toString()
//         }
//     }
// }