import {req} from "../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings"
import {base64Adapter} from "../../../src/common/adapters/base64.adapter"
import {createBlogs} from "../helpers/blog-helpers"
import {createPosts} from "../helpers/post-helpers"
import {ObjectId} from "mongodb"
import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types"
import {PostOutputType} from "../../../src/features/posts/input-output-types/post-types"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongo-driver-db-connection"

describe('DELETE /posts', () => {
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
    it('- DELETE post unauthorized: STATUS 401', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE post with incorrect input id: STATUS 404', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${new ObjectId()}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
    it('+ DELETE post with correct input data: STATUS 204', async () => {
        const blogs: BlogOutputType[] = await createBlogs()
        const posts: PostOutputType[] = await createPosts(blogs)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
})