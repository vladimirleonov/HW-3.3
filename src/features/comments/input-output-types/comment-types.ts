import {LikeStatus} from "../../../db/db-types/comment-db-types";

export type CommentIdParamInputType = {
    commentId: string
}

export type CommentBodyInputType = {
    content: string
}

type commentatorInfoType = {
    userId: string,
    userLogin: string
}

export type CommentOutputType = {
    id: string,
    content: string,
    commentatorInfo: commentatorInfoType,
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatus
    }
}

export type CommentsPaginationOutputType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentOutputType[]
}