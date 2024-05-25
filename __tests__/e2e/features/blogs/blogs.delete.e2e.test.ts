import {req} from "../../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../../src/settings"
import {encodeToBase64} from "../../../../src/common/helpers/auth-helpers"
import {clearTestDB, closeTestDB, connectToTestDB} from "../../../test-db"
import {createBlogs} from "../../../helpers/dataset-helpers/blogsDatasets"
import {blogCollection} from "../../../../src/db/mongo-db"
import {ObjectId} from "mongodb"
import {OutputBlogType} from "../../../../src/features/blogs/input-output-types/blog-types";

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
    it('- DELETE blogs unauthorized: STATUS 401', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE blogs with incorrect input id: STATUS 404', async () => {
        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${new ObjectId()}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
    it('+ DELETE blogs with correct input data: STATUS 204', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
})