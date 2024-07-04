import {WithId} from "mongodb";
import {HydratedDocument} from "mongoose";

export type BlogDBType = WithId<{
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}>

export type BlogDocument = HydratedDocument<BlogDBType>