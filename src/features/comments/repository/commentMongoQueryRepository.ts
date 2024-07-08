import {CommentModel} from "../../../db/models/comment.model"
import {CommentOutputType, CommentsPaginationOutputType} from "../input-output-types/comment-types"
import {ObjectId} from "mongodb"
import {SanitizedDefaultQueryParamsType} from "../../../common/helpers/queryParamsSanitizer"
import {CommentDbType, LikeStatus} from "../../../db/db-types/comment-db-types";

export const commentMongoQueryRepository = {
    async findAllPostCommentsForOutput(query: SanitizedDefaultQueryParamsType, postId: string, userId: string): Promise<CommentsPaginationOutputType> {
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
            items: comments.map((comment: CommentDbType) => this.mapToOutput(comment, userId))
        }
    },
    async findForOutputById({userId, commentId}: {userId: string, commentId: string}): Promise<CommentOutputType | null> {
        console.log("userId", userId)
        console.log("commentId", commentId)
        if(userId && !this.isValidObjectId(userId)) {
            return null
        }
        if (!this.isValidObjectId(commentId)) {
            return null
        }
        const comment: CommentDbType | null = await CommentModel.findById(new ObjectId(commentId))
        if(!comment) {
            return null
        }

        return this.mapToOutput(comment, userId)
    },
    mapToOutput(comment: CommentDbType, userId: string): CommentOutputType {
        const {_id, postId, content, commentatorInfo: {userId: commentatorUserId, userLogin}, createdAt, likesCount, dislikesCount, ...rest} = comment
        return {
            id: _id.toString(),
            content,
            commentatorInfo: {
                userId: commentatorUserId,
                userLogin
            },
            createdAt,
            likesInfo: {
                likesCount: likesCount,
                dislikesCount: dislikesCount,
                myStatus: userId ? comment.getUserLikeStatusByUserId(userId): LikeStatus.None
            }
        }
    },
    isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}