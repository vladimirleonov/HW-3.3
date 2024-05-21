import {PostDbType} from "../../../db/db-types/post-db-types"
import {OutputPostPaginationType, OutputPostType} from "../../../input-output-types/post-types"
import {postCollection} from "../../../db/mongo-db"
import {ObjectId} from "mongodb"

import {SanitizedDefaultQueryParamsType} from "../../../helpers/queryParamsSanitizer";

export const postMongoQueryRepository = {
    async findAllForOutput(query: SanitizedDefaultQueryParamsType, blogId?: string): Promise<OutputPostPaginationType> {
        const byId = blogId ? {blogId: new ObjectId(blogId)} : {}

        const filter = {
            ...byId
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
    },
    async findForOutputById(id: string): Promise<OutputPostType> {
        const post: PostDbType | null = await postCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            throw new Error('Post not found')
        }
        return this.mapToOutput(post)
    },
    mapToOutput({_id, blogId, ...rest}: PostDbType): OutputPostType {
        return {
            id: _id.toString(),
            blogId: blogId.toString(),
            ...rest
        }
    }
}