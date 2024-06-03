import {db} from "../../../db/mongo-db"
import {CommentDbType} from "../../../db/db-types/comment-db-types"
import {CommentOutputType, CommentsPaginationOutputType} from "../input-output-types/comment-types"
import {ObjectId} from "mongodb"
import {SanitizedDefaultQueryParamsType} from "../../../common/helpers/queryParamsSanitizer"

export const commentMongoQueryRepository = {
    async findAllPostCommentsForOutput(query: SanitizedDefaultQueryParamsType, postId: string): Promise<CommentsPaginationOutputType> {
        const byId = postId ? {postId: new ObjectId(postId)} : {}

        const filter = {
            ...byId
        }

        const comments: CommentDbType[] = await db.getCollections().commentCollection
            .find(filter)
            .sort(query.sortBy, query.sortDirection)
            .skip((query.pageNumber - 1) * query.pageSize)
            .limit(query.pageSize)
            .toArray()

        // console.log("delete many")
        // await db.getCollections().commentCollection.deleteMany({ })

        const totalCount: number = await db.getCollections().commentCollection.countDocuments(filter)

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
        const comment: CommentDbType | null = await db.getCollections().commentCollection.findOne({_id: new ObjectId(id)})
        if (!comment) {
            return null
        }

        return this.mapToOutput(comment)
    },
    mapToOutput({_id, postId, ...rest}: CommentDbType): CommentOutputType {
        return {
            id: _id.toString(),
            ...rest
        }
    },
    isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}