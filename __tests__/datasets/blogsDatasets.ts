import {BlogDBType} from "../../src/db/db-types/blog-db-types";
import {DBType} from "../../src/db/db";

const blog1: BlogDBType = {
    id: 'blogId1',
    name: 'name1',
    description: 'description1',
    websiteUrl: 'https://youtube.com'
}

export const blogsDataset: Required<Partial<DBType>> = {
    blogs: [blog1]
} as Required<Partial<DBType>>

