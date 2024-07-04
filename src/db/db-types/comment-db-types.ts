import {ObjectId, WithId} from "mongodb";

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