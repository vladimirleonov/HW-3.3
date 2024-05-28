import {req} from "../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings"
import {base64Service} from "../../../src/common/adapters/base64Service";
import {createBlogs} from "../../helpers/blog-helpers"
import {ObjectId} from "mongodb"
import {OutputBlogType} from "../../../src/features/blogs/input-output-types/blog-types";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/mongo-db";

describe('DELETE /blogs', () => {
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
    it('- DELETE blog unauthorized: STATUS 401', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE blog with incorrect input id: STATUS 404', async () => {
        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${new ObjectId()}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
    it('+ DELETE blog with correct input data: STATUS 204', async () => {
        const blogs: OutputBlogType[] = await createBlogs()

        await req
            .delete(`${SETTINGS.PATH.BLOGS}/${blogs[0].id}`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
})