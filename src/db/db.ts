import {BlogDBType} from "./db-types/blog-db-types"
import {PostDbType} from "./db-types/post-db-types"

export type DBType = {
    blogs: BlogDBType[]
    posts: PostDbType[]
}

export const db: DBType = {
    blogs: [],
    posts: []
}

export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) {
        db.blogs = []
        db.posts = []
        return
    }

    if ('blogs' in dataset) {
        db.blogs = dataset.blogs || []
    }

    if ('posts' in dataset) {
        db.posts = dataset.posts || []
    }
}