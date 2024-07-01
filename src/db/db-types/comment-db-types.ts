import {ObjectId} from "mongodb"

type CommentatorInfoType = {
    userId: string,
    userLogin: string
}

export type CommentDbType = {
    _id: ObjectId,
    postId: ObjectId,
    content: string,
    commentatorInfo: CommentatorInfoType,
    createdAt: string
}