import {req} from "../../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../../src/settings"
import {InputBlogType} from "../../../../src/features/blogs/input-output-types/blog-types"
import {base64Service} from "../../../../src/common/adapters/base64Service";
import {createBlogs} from "../../../helpers/blog-helpers"
import {testSeeder} from "../../../testSeeder";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../../src/db/mongo-db";

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
    it('- PUT blogs unauthorized: STATUS 401', async () => {
        const blogs = await createBlogs()

        const blogForUpdate = testSeeder.createBlogDTO()

        await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[1].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(blogForUpdate)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ PUT blogs with correct input data: STATUS 204', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.NO_CONTENT)
    })
    it('- PUT blogs when name not passed: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: any = {
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name is missing or not a string'
            }
        )
    })
    it('- PUT blogs when name is not a string: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: InputBlogType = {
            name: 123 as any,
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name is missing or not a string'
            }
        )
    })
    it('- PUT blogs with incorrect name length: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: InputBlogType = {
            name: 'name2'.repeat(5),
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name must be less than 15 characters long'
            }
        )
    })
    it('- PUT blogs when description is not passed: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: any = {
            name: 'name2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description is missing or not a string'
            }
        )
    })
    it('- PUT blogs when description is not a string: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 123 as any,
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description is missing or not a string'
            }
        )
    })
    it('- PUT blogs with incorrect description length: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2'.repeat(50),
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description must be less than 500 characters long'
            }
        )
    })
    it('- PUT blogs when websiteUrl not passed: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: any = {
            name: 'name2',
            description: 'description2',
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        )
    })
    it('- PUT blogs when websiteUrl is not a string: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        )
    })
    it('- PUT blogs with incorrect websiteUrl length: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'https://' + 'youtube'.repeat(20) + '.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl must be less than 100 characters long'
            }
        )
    })
    it('- PUT blogs with incorrect websiteUrl: STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'http://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'Invalid value'
            }
        )
    })
    it('- PUT blogs with incorrect data (first errors): STATUS 400', async () => {
        const blogs = await createBlogs()

        const blogDataForUpdate: InputBlogType = {
            name: "",
            description: null as any,
            websiteUrl: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
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