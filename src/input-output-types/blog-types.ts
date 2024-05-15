export type InputBlogType = {
    name: string
    description: string
    websiteUrl: string
}

export type OutputBlogType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type InputIdType = {
    id: string
}

export type BlogQueryParamsType = {
    searchNameTerm?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number
}