import {ObjectId, WithId} from "mongodb"
import {HydratedDocument} from "mongoose";

export enum LikeStatus {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None'
}

export type CommentatorInfoType = {
    userId: string
    userLogin: string
}

export type LikeType = {
    createdAt: string
    status: LikeStatus
    authorId: string
}

export type CommentDbType = WithId<{
    postId: ObjectId
    content: string
    commentatorInfo: CommentatorInfoType
    likes: LikeType[]
    likesCount: Number
    dislikesCount: Number
    createdAt: string
}>

export type CommentDocument = HydratedDocument<CommentDbType>