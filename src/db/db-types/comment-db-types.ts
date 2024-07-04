import {ObjectId, WithId} from "mongodb"
import {HydratedDocument} from "mongoose";

export type CommentatorInfoType = {
    userId: string,
    userLogin: string
}

export type CommentDbType = WithId<{
    postId: ObjectId,
    content: string,
    commentatorInfo: CommentatorInfoType,
    createdAt: string
}>

export type CommentDocument = HydratedDocument<CommentDbType>