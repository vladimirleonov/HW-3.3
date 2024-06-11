import {req} from "../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings"
import {BlogBodyInputType} from "../../../src/features/blogs/input-output-types/blog-types"
import {base64Adapter} from "../../../src/common/adapters/base64.adapter"
import {createBlogs} from "../helpers/blog-helpers"
import {testSeeder} from "../../testSeeder"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongo-db"

describe('PUT /blogs', () => {
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
    it('- PUT blog unauthorized: STATUS 401', async () => {
        const blogs = await createBlogs()

        const blogForUpdate = testSeeder.createBlogDTO()

        await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[1].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(blogForUpdate)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ PUT blog with correct input data: STATUS 204', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: BlogBodyInputType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.NO_CONTENT)
    })
    it('- PUT blog when name not passed: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: any = {
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name is missing or not a string'
            }
        )
    })
    it('- PUT blog when name is not a string: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: BlogBodyInputType = {
            name: 123 as any,
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name is missing or not a string'
            }
        )
    })
    it('- PUT blog with incorrect name length: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: BlogBodyInputType = {
            name: 'name2'.repeat(5),
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name must be less than 15 characters long'
            }
        )
    })
    it('- PUT blog when description is not passed: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: any = {
            name: 'name2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description is missing or not a string'
            }
        )
    })
    it('- PUT blog when description is not a string: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: BlogBodyInputType = {
            name: 'name2',
            description: 123 as any,
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description is missing or not a string'
            }
        )
    })
    it('- PUT blog with incorrect description length: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: BlogBodyInputType = {
            name: 'name2',
            description: 'description2'.repeat(50),
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description must be less than 500 characters long'
            }
        )
    })
    it('- PUT blog when websiteUrl not passed: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: any = {
            name: 'name2',
            description: 'description2',
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        )
    })
    it('- PUT blog when websiteUrl is not a string: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: BlogBodyInputType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        )
    })
    it('- PUT blog with incorrect websiteUrl length: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: BlogBodyInputType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'https://' + 'youtube'.repeat(20) + '.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl must be less than 100 characters long'
            }
        )
    })
    it('- PUT blog with incorrect websiteUrl: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: BlogBodyInputType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'http://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'Invalid value'
            }
        )
    })
    it('- PUT blog with incorrect data (first errors): STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: BlogBodyInputType = {
            name: "",
            description: null as any,
            websiteUrl: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages).toEqual([
            {
                field: 'name',
                message: 'name is empty'
            },
            {
                field: 'description',
                message: 'description is missing or not a string'
            },
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        ])
    })
})