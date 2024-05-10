import { ObjectId } from "mongodb"
import { PostDbType } from "../../src/db/db-types/post-db-types"
import { BlogDBType } from "../../src/db/db-types/blog-db-types";

export const generatePostsDataset = (blogs: BlogDBType[], count = 2) => {
    const currentDate = new Date().toISOString();
    const posts: PostDbType[] = []

    for(let i = 0; i < count; i++) {
        const blog = blogs[i % blogs.length];
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

