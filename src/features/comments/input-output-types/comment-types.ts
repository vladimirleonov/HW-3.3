export type CommentIdParamType = {
    commentId: string
}


export type CommentInputType = {
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
}

export type OutputCommentsPaginationType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: CommentOutputType[]
}