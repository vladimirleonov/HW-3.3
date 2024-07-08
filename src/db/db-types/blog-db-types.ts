import {ObjectId} from "mongodb";
import {HydratedDocument} from "mongoose";

// export type BlogDBType = WithId<{
//     name: string
//     description: string
//     websiteUrl: string
//     createdAt: string
//     isMembership: boolean
// }>

export class BlogDBType {
    constructor(
        public _id: ObjectId,
        public name: string,
        public description: string,
        public websiteUrl: string,
        public createdAt: string,
        public isMembership: boolean
    ) {}
}

export type BlogDocument = HydratedDocument<BlogDBType>