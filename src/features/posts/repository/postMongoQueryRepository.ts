import {PostPaginationOutputType, PostOutputType} from "../input-output-types/post-types"
import {ObjectId} from "mongodb"

import {SanitizedDefaultQueryParamsType} from "../../../common/helpers/queryParamsSanitizer"
import { PostModel } from "../../../db/models/post.model"
import { WithId } from "mongodb"
import {PostDbType} from "../../../db/db-types/post-db-types";

export const postMongoQueryRepository = {
    async findAllForOutput(query: SanitizedDefaultQueryParamsType, blogId?: string): Promise<PostPaginationOutputType> {
        const byId = blogId ? {blogId: new ObjectId(blogId)} : {}

        const filter = {
            ...byId
        }

        const posts: WithId<PostDbType>[] = await PostModel
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean()
            .exec()

        const totalCount: number = await PostModel
            .countDocuments(filter)

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: posts.map((post: WithId<PostDbType>) => this.mapToOutput(post))
        }
    },
    async findForOutputById(id: string): Promise<PostOutputType | null> {
        const post: WithId<PostDbType> | null = await PostModel
            .findOne({_id: new ObjectId(id)}).lean()
        return post ? this.mapToOutput(post) : null
    },
    mapToOutput({_id, blogId, title, shortDescription, content, blogName, createdAt, ...rest}: WithId<PostDbType>): PostOutputType {
        return {
            id: _id.toString(),
            title,
            shortDescription,
            content,
            blogId: blogId.toString(),
            blogName,
            createdAt
        }
    }
}