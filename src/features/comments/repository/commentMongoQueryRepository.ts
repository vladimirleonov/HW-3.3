import {CommentDbType, CommentModel} from "../../../db/models/comment.model"
import {CommentOutputType, CommentsPaginationOutputType} from "../input-output-types/comment-types"
import {ObjectId} from "mongodb"
import {SanitizedDefaultQueryParamsType} from "../../../common/helpers/queryParamsSanitizer"
import { WithId } from "mongodb"

export const commentMongoQueryRepository = {
    async findAllPostCommentsForOutput(query: SanitizedDefaultQueryParamsType, postId: string): Promise<CommentsPaginationOutputType> {
        const byId = postId ? {postId: new ObjectId(postId)} : {}

        const filter = {
            ...byId
        }

        const comments: WithId<CommentDbType>[] = await CommentModel
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .lean()
            .exec()

        const totalCount: number = await CommentModel.countDocuments(filter)

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: comments.map((comment: WithId<CommentDbType>) => this.mapToOutput(comment))
        }
    },
    async findForOutputById(id: string): Promise<CommentOutputType | null> {
        if (!this.isValidObjectId(id)) {
            return null
        }
        const comment: WithId<CommentDbType> | null = await CommentModel.findOne({_id: new ObjectId(id)}).lean().exec()
        if (!comment) {
            return null
        }

        return this.mapToOutput(comment)
    },
    mapToOutput({_id, postId, ...rest}: WithId<CommentDbType>): CommentOutputType {
        return {
            id: _id.toString(),
            ...rest
        }
    },
    isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}