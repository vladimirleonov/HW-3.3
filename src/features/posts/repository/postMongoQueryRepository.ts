import {PostDbType} from "../../../db/db-types/post-db-types"
import {OutputPostPaginationType, OutputPostType} from "../../../input-output-types/post-types"
import {postCollection} from "../../../db/mongo-db"
import {ObjectId} from "mongodb"

import {SanitizedQueryParamsType} from "../../../helpers/query-helpers";

export const postMongoQueryRepository = {
    async findAll(query: SanitizedQueryParamsType, blogId?: ObjectId): Promise<OutputPostPaginationType> {
        try {
            const byId = blogId ? {blogId: blogId} : {}

            const filter = {
                ...byId
            }

            console.log(filter)

            const posts1: PostDbType[] = await postCollection
                .find(filter)
                .toArray()

            console.log(posts1)

            const posts: PostDbType[] = await postCollection
                .find(filter)
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray()

            console.log(posts)

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