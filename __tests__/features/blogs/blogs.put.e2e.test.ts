import {req} from "../../test-helpers"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings"
import {setDB} from "../../../src/db/db"
import {blogsDataset} from "../../datasets/blogsDatasets"
import {InputBlogType} from "../../../src/input-output-types/blog-types"
import {encodeToBase64} from "../../../src/helpers/auth-helper"

describe('PUT /blogs', () => {
    beforeAll(async () => {
        await req.delete('/testing/all-data').expect(HTTP_CODES.NO_CONTENT)
    })
    beforeEach(async () => {
        setDB()
    })
    it('- PUT blogs unauthorized', async () => {
        setDB(blogsDataset)

        const blogForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(blogForUpdate)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ PUT blogs with correct input data', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.NO_CONTENT)
    })
    it('- PUT blogs when name not passed ', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: any = {
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name is missing or not a string'
            }
        )
    })
    it('- PUT blogs when name is not a string', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: InputBlogType = {
            name: 123 as any,
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name is missing or not a string'
            }
        )
    })
    it('- PUT blogs with incorrect name length', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: InputBlogType = {
            name: 'name2'.repeat(5),
            description: 'description2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name must be less than 15 characters long'
            }
        )
    })
    it('- PUT blogs when description is not passed', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: any = {
            name: 'name2',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description is missing or not a string'
            }
        );
    })
    it('- PUT blogs when description is not a string', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 123 as any,
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description is missing or not a string'
            }
        );
    })
    it('- PUT blogs with incorrect description length', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2'.repeat(50),
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description must be less than 500 characters long'
            }
        );
    })
    it('- PUT blogs when websiteUrl not passed', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: any = {
            name: 'name2',
            description: 'description2',
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        );
    })
    it('- PUT blogs when websiteUrl is not a string', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        );
    })
    it('- PUT blogs with incorrect websiteUrl length', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'https://' + 'youtube'.repeat(20) + '.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl must be less than 100 characters long'
            }
        );
    })
    it('- PUT blogs with incorrect websiteUrl', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: InputBlogType = {
            name: 'name2',
            description: 'description2',
            websiteUrl: 'http://youtube.com'
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(blogDataForUpdate)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'Invalid value'
            }
        );
    })
    it('- PUT blogs with incorrect data (first errors)', async () => {
        setDB(blogsDataset)

        const blogDataForUpdate: InputBlogType = {
            name: "",
            description: null as any,
            websiteUrl: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
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
        ]);
    })
})