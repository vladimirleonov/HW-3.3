import {OutputBlogType} from "../../src/features/blogs/input-output-types/blog-types";
import {req} from "./req";
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../src/settings";
import {base64Service} from "../../src/common/adapters/base64Service";


export const createBlog = async (count: number = 2): Promise<OutputBlogType> => {
    const res =  await req
        .post(SETTINGS.PATH.BLOGS)
        .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
        .send({
            name: `name`,
            description: `description`,
            websiteUrl: `https://websiteUrl.com`
        })
        .expect(HTTP_CODES.UNAUTHORIZED)

    return res.body
}

export const createBlogs = async (count: number = 2): Promise<OutputBlogType[]> => {
    const blogs: OutputBlogType[] = []

    for (let i: number = 1; i <= count; i++) {
        const res =  await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send({
                name: `name${i}`,
                description: `description${i}`,
                websiteUrl: `https://websiteUrl${i}.com`
            }).expect(HTTP_CODES.CREATED)

        blogs.push(res.body)
    }
    const sortedBlogs: OutputBlogType[] = blogs.sort((a: OutputBlogType, b: OutputBlogType) => b.createdAt.localeCompare(a.createdAt))
    return sortedBlogs
}




// export const createBlogs = (count: number = 2): {blogs: BlogDBType[]} => {
//     const blogs: BlogDBType[] = []
//
//     for (let i: number = 1; i <= count; i++) {
//         const currentDate: string = new Date().toISOString()
//         blogs.push({
//             _id: new ObjectId(),
//             name: `name${i}`,
//             description: `description${i}`,
//             websiteUrl: `https://websiteUrl${i}.com`,
//             createdAt: currentDate,
//             isMembership: false
//         })
//     }
//
//     return { blogs }
// }
//
// export const createBlogs = (count: number = 2): {blogs: BlogDBType[]} => {
//     const blogs: BlogDBType[] = []
//
//     for (let i: number = 1; i <= count; i++) {
//         const currentDate: string = new Date().toISOString()
//         blogs.push({
//             _id: new ObjectId(),
//             name: `name${i}`,
//             description: `description${i}`,
//             websiteUrl: `https://websiteUrl${i}.com`,
//             createdAt: currentDate,
//             isMembership: false
//         })
//     }
//
//     return { blogs }
// }
