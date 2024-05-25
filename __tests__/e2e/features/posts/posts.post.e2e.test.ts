import {req} from "../../../helpers/req"
import {HTTP_CODES, SETTINGS} from "../../../../src/settings"
import {InputPostType} from "../../../../src/features/posts/input-output-types/post-types"
import {encodeToBase64} from "../../../../src/common/helpers/auth-helpers"
import {AUTH_DATA} from "../../../../src/settings"
import {createBlogs} from "../../../helpers/dataset-helpers/blogsDatasets"
import {clearTestDB, connectToTestDB, closeTestDB} from "../../../test-db"
import {OutputBlogType} from "../../../../src/features/blogs/input-output-types/blog-types";
import {testSeeder} from "../../../testSeeder";

describe('POST /posts', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    it('- POST post unauthorized: STATUS 401', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId = blogs[0].id

        const newPost: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(newPost)
            .expect(401)
    })
    it('+ POST post with correct input data: STATUS 201', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId: string = blogs[0].id

        const newPost: InputPostType = testSeeder.createPostDTO(blogId)

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.CREATED)

        expect(res.body.title).toEqual(newPost.title)
        expect(res.body.shortDescription).toEqual(newPost.shortDescription)
        expect(res.body.content).toEqual(newPost.content)
        expect(res.body.blogId).toEqual(newPost.blogId)
        expect(res.body.blogName).toEqual(blogs[0].name)
    })
    it('- POST post when title not passed: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId = blogs[0].id

        const newPost: any = {
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(400)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title is missing or not a string'
            }
        )
    })
    it('- POST post when title is not a string: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId = blogs[0].id

        const newPost: InputPostType = {
            title: 123 as any,
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title is missing or not a string'
            }
        )
    })
    it('- POST post with incorrect title length: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId = blogs[0].id

        const newPost: InputPostType = {
            title: 'title2'.repeat(10),
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title must be less than 30 characters long'
            }
        )
    })
    it('- POST post when shortDescription not passed: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId = blogs[0].id

        const newPost: any = {
            title: "title2",
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription is missing or not a string'
            }
        )
    })
    it('- POST post when shortDescription is not a string: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId = blogs[0].id

        const newPost: InputPostType = {
            title: "title2",
            shortDescription: 123 as any,
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription is missing or not a string'
            }
        )
    })
    it('- POST post with incorrect shortDescription length: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId = blogs[0].id

        const newPost: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2'.repeat(10),
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription must be less than 100 characters long'
            }
        )
    })
    it('- POST post when content not passed: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId = blogs[0].id

        const newPost: any = {
            title: "title2",
            shortDescription: 'shortDescription2',
            blogId: blogId
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content is missing or not a string'
            }
        )
    })
    it('- POST post when content is not a string: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId = blogs[0].id

        const newPost: InputPostType = {
            title: "title2",
            shortDescription: 'shortDescription2',
            content: 123 as any,
            blogId: blogId
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content is missing or not a string'
            }
        )
    })
    it('- POST post with incorrect content length: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        const blogId = blogs[0].id

        const newPost: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2'.repeat(130),
            blogId: blogId
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content must be less than 1000 characters long'
            }
        )
    })
    it('- POST post when blogId not passed: STATUS 400', async () => {
        const newPost: any = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'blogId is missing or not a string'
            }
        )
    })
    it('- POST post when blogId is not a string: STATUS 400', async () => {
        const newPost: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: 123 as any
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'blogId is missing or not a string'
            }
        )
    })
    it('- POST post when blogId is invalid: STATUS 400', async () => {
        const newPost: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: '-123'
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'invalid blogId!'
            }
        )
    })
    it('- POST post with incorrect data (first errors): STATUS 400', async () => {
        const newPost: any = {
            title: "",
            shortDescription: 123 as any,
            content: 123 as any,
            blogId: 123
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
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