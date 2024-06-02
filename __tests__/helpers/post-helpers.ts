import { PostDbType } from "../../src/db/db-types/post-db-types"
import {req} from "./req";
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../src/settings";
import {base64Service} from "../../src/common/adapters/base64Service";
import {BlogOutputType} from "../../src/features/blogs/input-output-types/blog-types";
import {PostOutputType} from "../../src/features/posts/input-output-types/post-types";


export const createPost= async (blogId: string): Promise<PostOutputType> => {
    const res = await req
        .post(SETTINGS.PATH.POSTS)
        .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
        .send({
            title: `title`,
            shortDescription: `shortDescription`,
            content: `content`,
            blogId
        })
        .expect(HTTP_CODES.CREATED)

    return res.body
}

export const createPosts= async (blogs: BlogOutputType[], count: number = 2): Promise<PostOutputType[]> => {
    const posts: PostOutputType[] = []

    for(let i: number = 0; i < count; i++) {
        const blog: BlogOutputType = blogs[i % blogs.length]

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send({
                title: `title${i}`,
                shortDescription: `shortDescription${i}`,
                content: `content${i}`,
                blogId: blog.id,
            })
            .expect(HTTP_CODES.CREATED)
        posts.push(res.body)
    }

    const sortedPosts: PostOutputType[] = posts.sort((a: PostOutputType, b: PostOutputType) => b.createdAt.localeCompare(a.createdAt))
    return sortedPosts
}

// export const createPosts= (blogs: BlogDBType[], count: number = 2): {posts: PostDbType[]} => {
//     const posts: PostDbType[] = []
//
//     for(let i: number = 0; i < count; i++) {
//         const blog: BlogDBType = blogs[i % blogs.length]
//         const currentDate: string = new Date().toISOString()
//         posts.push({
//             _id: new ObjectId(),
//             title: `title${i}`,
//             shortDescription: `shortDescription${i}`,
//             content: `content${i}`,
//             blogId: blog._id,
//             blogName: blog.name,
//             createdAt: currentDate,
//         })
//     }
//
//     return {posts}
// }

