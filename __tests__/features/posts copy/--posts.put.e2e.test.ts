import {req} from "../../test-helpers";
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings";
import {setDB} from "../../../src/db/db";
import {blogsDataset} from "../../datasets/blogsDatasets"
import {postsDataset} from "../../datasets/postsDatasets";
import {InputPostType} from "../../../src/input-output-types/post-types";
import {encodeToBase64} from "../../../src/helpers/auth-helper";

describe('PUT /posts', () => {
    beforeAll(async () => {
        await req.delete('/testing/all-data').expect(HTTP_CODES.NO_CONTENT)
    })
    beforeEach(async () => {
        setDB()
    })
    it('- PUT posts unauthorized', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ PUT posts with correct input data', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.NO_CONTENT)
    })
    it('- PUT posts when title not passed', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: any = {
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title is missing or not a string'
            }
        );
    })
    it('- PUT posts when title is not a string', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: InputPostType = {
            title: 123 as any,
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title is missing or not a string'
            }
        );
    })
    it('- PUT posts when title is too long', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: InputPostType = {
            title: 'title2'.repeat(10),
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title must be less than 30 characters long'
            }
        );
    })
    it('- PUT posts when shortDescription not passed', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: any = {
            title: "title2",
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription is missing or not a string'
            }
        );
    })
    it('- PUT posts when shortDescription is not a string', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: InputPostType = {
            title: "title2",
            shortDescription: 123 as any,
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription is missing or not a string'
            }
        );
    })
    it('- PUT posts when shortDescription is too long', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2'.repeat(10),
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription must be less than 100 characters long'
            }
        );
    })
    it('- PUT posts when content not passed', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: any = {
            title: "title2",
            shortDescription: "shortDescription2",
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content is missing or not a string'
            }
        );
    })
    it('- PUT posts when content is not a string', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: InputPostType = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: 123 as any,
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content is missing or not a string'
            }
        );
    })
    it('- PUT posts when content is too long', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2'.repeat(130),
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content must be less than 1000 characters long'
            }
        );
    })
    it('- PUT posts when blogId not passed', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: any = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: "content2",
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'blogId is missing or not a string'
            }
        );
    })
    it('- PUT posts when blogId is not a string', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: InputPostType = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: "content2",
            blogId: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'blogId is missing or not a string'
            }
        );
    })
    it('- PUT posts when blogId is invalid', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const blogId = postsDataset.posts[0].blogId;

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: '-123'
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'invalid blogId!'
            }
        );
    })
    it('- PUT posts with incorrect data (first errors)', async () => {
        setDB(blogsDataset)
        setDB(postsDataset)

        const postForUpdating: InputPostType = {
            title: "",
            shortDescription: 123 as any,
            content: 123 as any,
            blogId: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
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
        ]);
    })
})