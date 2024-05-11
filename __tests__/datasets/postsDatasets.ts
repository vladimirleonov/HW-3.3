import { ObjectId } from "mongodb"
import { PostDbType } from "../../src/db/db-types/post-db-types"
import { BlogDBType } from "../../src/db/db-types/blog-db-types";

export const generatePostsDataset = (blogs: BlogDBType[], count: number = 2): {posts: PostDbType[]} => {
    const currentDate: string = new Date().toISOString();
    const posts: PostDbType[] = []

    for(let i: number = 0; i < count; i++) {
        const blog: BlogDBType = blogs[i % blogs.length];
        posts.push({
            _id: new ObjectId(),
            title: `title${i}`,
            shortDescription: `shortDescription${i}`,
            content: `content${i}`,
            blogId: blog._id,
            blogName: blog.name,
            createdAt: currentDate,
        })
    }

    return {posts}
}

