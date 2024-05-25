import {PostDbType} from "../../../db/db-types/post-db-types"
import {OutputPostPaginationType, OutputPostType} from "../input-output-types/post-types"
//import {postCollection} from "../../../db/mongo-db"
import {ObjectId} from "mongodb"

import {SanitizedDefaultQueryParamsType} from "../../../common/helpers/queryParamsSanitizer";
import {db} from "../../../db/mongo-db";

export const postMongoQueryRepository = {
    async findAllForOutput(query: SanitizedDefaultQueryParamsType, blogId?: string): Promise<OutputPostPaginationType> {
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
    async findForOutputById(id: string): Promise<{ error?: string, post?: OutputPostType }> {
        const post: PostDbType | null = await db.getCollections().postCollection
            .findOne({_id: new ObjectId(id)})
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