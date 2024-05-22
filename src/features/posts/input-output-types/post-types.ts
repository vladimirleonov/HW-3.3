export type InputPostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type InputBlogPostType = {
    title: string,
    shortDescription: string,
    content: string
}

export type OutputPostType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type OutputPostPaginationType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: OutputPostType[]
}