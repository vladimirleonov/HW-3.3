import {req} from "../../test-helpers/req";
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings";
import {encodeToBase64} from "../../../src/helpers/auth-helper";
import {clearTestDB, closeTestDB, connectToTestDB} from "../../test-helpers/test-db";
import {generateBlogsDataset} from "../../datasets/blogsDatasets";
import {blogCollection} from "../../../src/db/mongo-db";
import {ObjectId} from "mongodb";

describe('DELETE /blogs', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    it('- DELETE blogs unauthorized', async () => {
        const blogsDataset = generateBlogsDataset()
        await blogCollection.insertMany(blogsDataset.blogs)

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0]._id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE blogs with incorrect input id', async () => {
        const blogsDataset = generateBlogsDataset()
        await blogCollection.insertMany(blogsDataset.blogs)

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${new ObjectId()}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
    it('+ DELETE blogs with correct input data', async () => {
        const blogsDataset = generateBlogsDataset()
        await blogCollection.insertMany(blogsDataset.blogs)

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogsDataset.blogs[0]._id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
})