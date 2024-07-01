import {PostDbType} from "../../../db/db-types/post-db-types"
import {PostPaginationOutputType, PostOutputType} from "../input-output-types/post-types"
import {ObjectId} from "mongodb"

import {SanitizedDefaultQueryParamsType} from "../../../common/helpers/queryParamsSanitizer"
import {db} from "../../../db/mongo-driver-db-connection"

export const postMongoQueryRepository = {
    async findAllForOutput(query: SanitizedDefaultQueryParamsType, blogId?: string): Promise<PostPaginationOutputType> {
        const byId = blogId ? {blogId: new ObjectId(blogId)} : {}

        const filter = {
            ...byId
        }

        const posts: PostDbType[] = await db.getCollections().postCollection
            .find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        const totalCount: number = await db.getCollections().postCollection
            .countDocuments(filter)

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: posts.map((post: PostDbType) => this.mapToOutput(post))
        }
    },
    async findForOutputById(id: string): Promise<PostOutputType | null> {
        const post: PostDbType | null = await db.getCollections().postCollection
            .findOne({_id: new ObjectId(id)})
        return post ? this.mapToOutput(post) : null
    },
    mapToOutput({_id, blogId, ...rest}: PostDbType): PostOutputType {
        return {
            id: _id.toString(),
            blogId: blogId.toString(),
            ...rest
        }
    }
}