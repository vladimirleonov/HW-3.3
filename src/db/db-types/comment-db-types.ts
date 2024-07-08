import {ObjectId, WithId} from "mongodb"
import {HydratedDocument} from "mongoose";

export enum LikeStatus {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None'
}

// export type CommentatorInfoType = {
//     userId: string
//     userLogin: string
// }

export class CommentatorInfo {
    constructor(
        public userId: string,
        public userLogin: string
    ) {}
}

// export type LikeType = {
//     createdAt: string
//     status: LikeStatus
//     authorId: string
// }

export class Like {
    constructor(
        public createdAt: string,
        public status: LikeStatus,
        public authorId: string
    ) {}
}

// export type CommentDbType = WithId<{
//     postId: ObjectId
//     content: string
//     commentatorInfo: CommentatorInfoType
//     likes: LikeType[]
//     likesCount: number
//     dislikesCount: number
//     createdAt: string,
//     getUserLikeStatusByUserId: (userId: string) => LikeStatus
// }>

export class Comment {
    constructor(
        public _id: ObjectId,
        public postId: ObjectId,
        public content: string,
        public commentatorInfo: CommentatorInfo,
        public likes: Like[],
        public likesCount: number,
        public dislikesCount: number,
        public createdAt: string
    ) {}
    getUserLikeStatusByUserId (userId: string): LikeStatus {
        throw new Error("Method implemented in schema");
    }
}

export type CommentDocument = HydratedDocument<Comment>