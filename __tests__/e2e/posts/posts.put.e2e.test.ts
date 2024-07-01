import {req} from "../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings"
import {PostBodyInputType, PostOutputType} from "../../../src/features/posts/input-output-types/post-types"
import {base64Adapter} from "../../../src/common/adapters/base64.adapter"
import {createBlogs} from "../helpers/blog-helpers"
import {createPosts} from "../helpers/post-helpers"
import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongo-driver-db-connection"

describe('PUT /posts', () => {
    beforeAll(async () => {
        const mongoServer: MongoMemoryServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })
    afterAll(async () => {
        await db.stop()
    })
    beforeEach(async () => {
        await db.drop()
    })
    it('- PUT post unauthorized: STATUS 401', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: PostBodyInputType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ PUT post with correct input data: STATUS 204', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: PostBodyInputType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.NO_CONTENT)
    })
    it('- PUT post when title not passed', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: any = {
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title is missing or not a string'
            }
        )
    })
    it('- PUT post when title is not a string: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: PostBodyInputType = {
            title: 123 as any,
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title is missing or not a string'
            }
        )
    })
    it('- PUT post when title is too long: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: PostBodyInputType = {
            title: 'title2'.repeat(10),
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title must be less than 30 characters long'
            }
        )
    })
    it('- PUT post when shortDescription not passed: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: any = {
            title: "title2",
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription is missing or not a string'
            }
        )
    })
    it('- PUT post when shortDescription is not a string: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: PostBodyInputType = {
            title: "title2",
            shortDescription: 123 as any,
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription is missing or not a string'
            }
        )
    })
    it('- PUT post when shortDescription is too long: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: PostBodyInputType = {
            title: 'title2',
            shortDescription: 'shortDescription2'.repeat(10),
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription must be less than 100 characters long'
            }
        )
    })
    it('- PUT post when content not passed: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: any = {
            title: "title2",
            shortDescription: "shortDescription2",
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content is missing or not a string'
            }
        )
    })
    it('- PUT post when content is not a string: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: PostBodyInputType = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: 123 as any,
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content is missing or not a string'
            }
        )
    })
    it('- PUT post when content is too long: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: PostBodyInputType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2'.repeat(130),
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content must be less than 1000 characters long'
            }
        )
    })
    it('- PUT post when blogId not passed: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const postForUpdating: any = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: "content2",
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'blogId is missing or not a string'
            }
        )
    })
    it('- PUT post when blogId is not a string: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const postForUpdating: PostBodyInputType = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: "content2",
            blogId: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'blogId is missing or not a string'
            }
        )
    })
    it('- PUT post when blogId is invalid: STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const postForUpdating: PostBodyInputType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: '-123'
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'invalid blogId!'
            }
        )
    })
    it('- PUT post with incorrect data (first errors): STATUS 400', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        const postForUpdating: PostBodyInputType = {
            title: "",
            shortDescription: 123 as any,
            content: 123 as any,
            blogId: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages).toEqual([
            {
                field: 'title',
                message: 'title is empty'
            },
            {
                field: 'shortDescription',
                message: 'shortDescription is missing or not a string'
            },
            {
                field: 'content',
                message: 'content is missing or not a string'
            },
            {
                field: 'blogId',
                message: 'blogId is missing or not a string'
            }
        ])
    })
})