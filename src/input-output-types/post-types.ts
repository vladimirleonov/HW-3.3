export type InputPostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
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

export type InputIdType = {
    id: string
}