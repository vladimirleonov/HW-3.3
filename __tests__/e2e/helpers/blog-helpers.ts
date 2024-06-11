import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types"
import {req} from "../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings"
import {base64Adapter} from "../../../src/common/adapters/base64.adapter"


export const createBlog = async (count: number = 2): Promise<BlogOutputType> => {
    const res = await req
        .post(SETTINGS.PATH.BLOGS)
        .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
        .send({
            name: `name`,
            description: `description`,
            websiteUrl: `https://websiteUrl.com`
        })
        .expect(HTTP_CODES.CREATED)

    return res.body
}

export const createBlogs = async (count: number = 2): Promise<BlogOutputType[]> => {
    const blogs: BlogOutputType[] = []

    for (let i: number = 1; i <= count; i++) {
        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send({
                name: `name${i}`,
                description: `description${i}`,
                websiteUrl: `https://websiteUrl${i}.com`
            }).expect(HTTP_CODES.CREATED)

        blogs.push(res.body)
    }
    const sortedBlogs: BlogOutputType[] = blogs.sort((a: BlogOutputType, b: BlogOutputType) => b.createdAt.localeCompare(a.createdAt))
    return sortedBlogs
}