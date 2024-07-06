import {CommentModel} from "../../../db/models/comment.model"
import {CommentOutputType, CommentsPaginationOutputType} from "../input-output-types/comment-types"
import {ObjectId} from "mongodb"
import {SanitizedDefaultQueryParamsType} from "../../../common/helpers/queryParamsSanitizer"
import {CommentDbType, LikeStatus} from "../../../db/db-types/comment-db-types";

export const commentMongoQueryRepository = {
    async findAllPostCommentsForOutput(query: SanitizedDefaultQueryParamsType, postId: string): Promise<CommentsPaginationOutputType> {
        const byId = postId ? {postId: new ObjectId(postId)} : {}

        const filter = {
            ...byId
        }

        const comments: CommentDbType[] = await CommentModel
            .find(filter)
            .sort({ [query.sortBy]: query.sortDirection === 'asc' ? 1 : -1 })
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)

        const totalCount: number = await CommentModel.countDocuments(filter)

        return {
            pagesCount: Math.ceil(totalCount / query.pageSize),
            page: query.pageNumber,
            pageSize: query.pageSize,
            totalCount,
            items: comments.map((comment: CommentDbType) => this.mapToOutput(comment))
        }
    },
    async findForOutputById(id: string): Promise<CommentOutputType | null> {
        if (!this.isValidObjectId(id)) {
            return null
        }
        const comment: CommentDbType | null = await CommentModel.findOne({_id: new ObjectId(id)})
        if(!comment) {
            return null
        }

        return this.mapToOutput(comment)
    },
    mapToOutput({_id, postId, content, commentatorInfo: {userId, userLogin}, createdAt, likesCount, dislikesCount, ...rest}: CommentDbType): CommentOutputType {
        return {
            id: _id.toString(),
            content,
            commentatorInfo: {
                userId,
                userLogin
            },
            createdAt,
            likesInfo: {
                likesCount: likesCount,
                dislikesCount: dislikesCount,
                myStatus: CommentModel.get
            }
        }
    },
    isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}