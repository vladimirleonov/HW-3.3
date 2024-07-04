import {WithId} from "mongodb";

export type BlogDBType = WithId<{
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}>