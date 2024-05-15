import {PostDbType} from "../../../db/db-types/post-db-types"
import {InputPostType, OutputPostPaginationType, OutputPostType} from "../../../input-output-types/post-types"
import {postCollection} from "../../../db/mongo-db"
import {InsertOneResult, ObjectId} from "mongodb"
import {blogMongoRepository} from "../../blogs/repository/blogMongoRepository"
import {BlogDBType} from "../../../db/db-types/blog-db-types"
import {SanitizedQueryParamsType} from "../../../helpers/query-helpers";

export const postMongoQueryRepository = {
    async findAll(query: SanitizedQueryParamsType, blogId: ObjectId ): Promise<OutputPostPaginationType> {
        try {
            console.log(query)
            // {
            //     searchNameTerm: null,
            //     sortBy: 'createdAt',
            //     sortDirection: 'desc',
            //     pageNumber: 1,
            //     pageSize: 10
            // }
            console.log(blogId)
            // new ObjectId('66446da5dd276959a1fb34f9')

            const filter = {
                blogId
            }

            const posts: PostDbType[] = await postCollection
                .find(filter)
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray()

            const totalCount: number = await postCollection.countDocuments(filter)

            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount,
                items: posts.map((post: PostDbType) => this.mapToOutput(post))
            }
            // {
            //     "pagesCount": 0,
            //     "page": 0,
            //     "pageSize": 0,
            //     "totalCount": 0,
            //     "items": [
            //         {
            //             "id": "string",
            //             "title": "string",
            //             "shortDescription": "string",
            //             "content": "string",
            //             "blogId": "string",
            //             "blogName": "string",
            //             "createdAt": "2024-05-15T11:55:04.855Z"
            //         }
            //     ]
            // }
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
    // async findAllForOutput(): Promise<OutputPostType[]> {
    //     const posts: PostDbType[] = await this.findAll()
    //     return posts.map((post: PostDbType): OutputPostType => this.mapToOutput(post))
    // },
    async findForOutputById(id: ObjectId): Promise<{ post?: OutputPostType, error?: string }> {
        const post: PostDbType | null = await this.findById(id)
        if (!post) {
            return {error: 'Post not found'}
        }
        return {post: this.mapToOutput(post)}
    },
    mapToOutput({_id, blogId, ...rest}: PostDbType): OutputPostType {
        return {
            id: _id.toString(),
            blogId: blogId.toString(),
            ...rest
        }
    }
}