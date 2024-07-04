import {ObjectId, WithId} from "mongodb";
import {HydratedDocument} from "mongoose";

export type PostDbType = WithId<{
    title: string
    shortDescription: string
    content: string
    blogId: ObjectId
    blogName: string
    createdAt: string
}>

export type PostDocument = HydratedDocument<PostDbType>