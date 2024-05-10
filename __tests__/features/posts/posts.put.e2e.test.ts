import {req} from "../../test-helpers/req";
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings";
import {InputPostType} from "../../../src/input-output-types/post-types";
import {encodeToBase64} from "../../../src/helpers/auth-helper";
import {generateBlogsDataset} from "../../datasets/blogsDatasets";
import {generatePostsDataset} from "../../datasets/postsDatasets";
import {postCollection, blogCollection} from "../../../src/db/mongo-db";
import {clearTestDB, connectToTestDB, closeTestDB} from "../../test-helpers/test-db";

describe('PUT /posts', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    it('- PUT posts unauthorized', async () => {
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ PUT posts with correct input data', async () => {
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.NO_CONTENT)
    })
    it('- PUT posts when title not passed', async () => {
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: any = {
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: InputPostType = {
            title: 123 as any,
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: InputPostType = {
            title: 'title2'.repeat(10),
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: any = {
            title: "title2",
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: InputPostType = {
            title: "title2",
            shortDescription: 123 as any,
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2'.repeat(10),
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: any = {
            title: "title2",
            shortDescription: "shortDescription2",
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: InputPostType = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: 123 as any,
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const blogId = blogsDataset.blogs[0]._id.toString();

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2'.repeat(130),
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const postForUpdating: any = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: "content2",
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const postForUpdating: InputPostType = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: "content2",
            blogId: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: '-123'
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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
        const blogsDataset = generateBlogsDataset(2)
        await blogCollection.insertMany(blogsDataset.blogs)

        const postsDataset = generatePostsDataset(blogsDataset.blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        const postForUpdating: InputPostType = {
            title: "",
            shortDescription: 123 as any,
            content: 123 as any,
            blogId: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
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