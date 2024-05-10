import {req} from "../../test-helpers";
import {HTTP_CODES, SETTINGS} from "../../../src/settings";
import {setDB} from "../../../src/db/db";
import {blogsDataset} from "../../datasets/blogsDatasets"
import {InputPostType} from "../../../src/input-output-types/post-types";
import {encodeToBase64} from "../../../src/helpers/auth-helper";
import {AUTH_DATA} from "../../../src/settings";

describe('POST /posts', () => {
    beforeAll(async () => {
        await req.delete('/testing/all-data').expect(HTTP_CODES.NO_CONTENT)
    })
    beforeEach(async () => {
        setDB()
    })
    it('- POST posts unauthorized', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

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
    it('+ POST posts with correct input data', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

        const newPost: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newPost)
            .expect(HTTP_CODES.CREATED)

        expect(res.body.title).toEqual(newPost.title)
        expect(res.body.shortDescription).toEqual(newPost.shortDescription)
        expect(res.body.content).toEqual(newPost.content)
        expect(res.body.blogId).toEqual(newPost.blogId)
        expect(res.body.blogName).toEqual(blogsDataset.blogs[0].name)
    })
    it('- POST posts when title not passed', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

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
        );
    })
    it('- POST posts when title is not a string', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

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
        );
    })
    it('- POST posts with incorrect title length', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

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
        );
    })
    it('- POST posts when shortDescription not passed', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

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
        );
    })
    it('- POST posts when shortDescription is not a string', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

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
        );
    })
    it('- POST posts with incorrect shortDescription length', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

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
        );
    })
    it('- POST posts when content not passed', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

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
        );
    })
    it('- POST posts when content is not a string', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

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
        );
    })
    it('- POST posts with incorrect content length', async () => {
        setDB(blogsDataset)

        const blogId = blogsDataset.blogs[0].id;

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
        );
    })
    it('- POST posts when blogId not passed', async () => {
        setDB(blogsDataset)

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
        );
    })
    it('- POST posts when blogId is not a string', async () => {
        setDB(blogsDataset)

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
        );
    })
    it('- POST posts when blogId is invalid', async () => {
        setDB(blogsDataset)

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
        );
    })
    it('- POST posts with incorrect data (first errors)', async () => {
        setDB(blogsDataset)

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
        ]);
    })
})