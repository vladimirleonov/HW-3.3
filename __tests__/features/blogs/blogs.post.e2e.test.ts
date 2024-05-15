import {req} from "../../test-helpers/req"
import {HTTP_CODES, SETTINGS} from "../../../src/settings"
import {InputBlogType} from "../../../src/input-output-types/blog-types"
import {encodeToBase64} from "../../../src/helpers/auth-helpers"
import {AUTH_DATA} from "../../../src/settings"
import {clearTestDB, closeTestDB, connectToTestDB} from "../../test-helpers/test-db"

describe('POST /blogs', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    it('- POST blogs unauthorized', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 'description1',
            websiteUrl: 'https://youtube.com'
        }

        await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ POST blogs with correct input data', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 'description1',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.CREATED)


        expect(res.body.name).toEqual(newBlog.name)
        expect(res.body.description).toEqual(newBlog.description)
        expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl)
    })
    it('- POST blogs when name not passed', async () => {
        const newBlog: any = {
            description: 'description1',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name is missing or not a string'
            }
        )
    })
    it('- POST blogs when name is not a string', async () => {
        const newBlog: InputBlogType = {
            name: 123 as any,
            description: 'description1',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name is missing or not a string'
            }
        )
    })
    it('- POST blogs with incorrect name length', async () => {
        const newBlog: InputBlogType = {
            name: 'name1'.repeat(5),
            description: 'description1',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name must be less than 15 characters long'
            }
        )
    })
    it('- POST blogs when description not passed', async () => {
        const newBlog: any = {
            name: 'name1',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description is missing or not a string'
            }
        )
    })
    it('- POST blogs when description is not a string', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 123 as any,
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description is missing or not a string'
            }
        )
    })
    it('- POST blogs with incorrect description length', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 'description1'.repeat(50),
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description must be less than 500 characters long'
            }
        )
    })
    it('- POST blogs when websiteUrl not passed', async () => {
        const newBlog: any = {
            name: 'name1',
            description: 'description1',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        )
    })
    it('- POST blogs when websiteUrl is not a string', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 'description1',
            websiteUrl: 123 as any
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        )
    })
    it('- POST blogs with incorrect websiteUrl length', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 'description1',
            websiteUrl: 'https://' + 'youtube'.repeat(20) + '.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl must be less than 100 characters long'
            }
        )
    })
    it('- POST blogs with incorrect websiteUrl', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 'description1',
            websiteUrl: 'http://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'Invalid value'
            }
        )
    })
    it('- POST blogs with incorrect data (first errors)', async () => {
        const newBlog: InputBlogType = {
            name: "",
            description: null as any,
            websiteUrl: 123 as any
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
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