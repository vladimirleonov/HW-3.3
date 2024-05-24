import {req} from "../../../test-helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../../src/settings"
import {encodeToBase64} from "../../../../src/common/helpers/auth-helpers"
import {createBlogs} from "../../../test-helpers/dataset-helpers/blogsDatasets"
import {createPosts} from "../../../test-helpers/dataset-helpers/postsDatasets"
import {postCollection, blogCollection} from "../../../../src/db/mongo-db"
import {clearTestDB, connectToTestDB, closeTestDB} from "../../../test-helpers/test-db"
import {ObjectId} from "mongodb"

describe('DELETE /posts', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    it('- DELETE posts unauthorized', async () => {
        const {blogs} = createBlogs(2)
        await blogCollection.insertMany(blogs)

        const postsDataset = createPosts(blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE posts with incorrect input id', async () => {
        const {blogs} = createBlogs(2)
        await blogCollection.insertMany(blogs)

        const postsDataset = createPosts(blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${new ObjectId()}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
    it('+ DELETE posts with correct input data', async () => {
        const {blogs} = createBlogs(2)
        await blogCollection.insertMany(blogs)

        const postsDataset = createPosts(blogs, 2)
        await postCollection.insertMany(postsDataset.posts)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${postsDataset.posts[0]._id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
})