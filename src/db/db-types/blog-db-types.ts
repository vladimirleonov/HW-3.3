//import {ObjectId, WithId} from "mongodb";

export type BlogDBType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

// const BlogDBTypeWithID = ObjectId<BlogDBType>

