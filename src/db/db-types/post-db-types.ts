import {ObjectId} from "mongodb";
import {HydratedDocument} from "mongoose";

// export type PostDbType = WithId<{
//     title: string
//     shortDescription: string
//     content: string
//     blogId: ObjectId
//     blogName: string
//     createdAt: string
// }>

export class Post {
    constructor(
        public _id: ObjectId,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: ObjectId,
        public blogName: string,
        public createdAt: string
    ) {}
}

export type PostDocument = HydratedDocument<Post>