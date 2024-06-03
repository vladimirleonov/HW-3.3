export type PostIdParamType = {
    postId: string
}

export type PostBodyInputType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type BlogPostInputType = {
    title: string
    shortDescription: string
    content: string
}

export type PostOutputType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostPaginationOutputType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostOutputType[]
}