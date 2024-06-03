import {req} from "../../helpers/req"
import {HTTP_CODES, SETTINGS} from "../../../src/settings"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongo-db"
import {createPost} from "../../helpers/post-helpers"
import {PostOutputType} from "../../../src/features/posts/input-output-types/post-types"
import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types"
import {createBlog} from "../../helpers/blog-helpers"
import {loginUser} from "../../helpers/auth-helpers"
import {LoginOutputType} from "../../../src/features/auth/input-output-types/auth-types"
import {createComments} from "../../helpers/comment-helpers"
import {ObjectId} from "mongodb"

describe('GET /comments', () => {
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
    it('+ GET comments for specified post: STATUS 200', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const authData: LoginOutputType = await loginUser()

        await createComments(2, postId, authData.accessToken)

        await req
            .get(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .expect(HTTP_CODES.OK)
    })
    it('- GET comments for non-existent post: STATUS 404', async () => {

        const res = await req
            .get(`${SETTINGS.PATH.POSTS}/${new ObjectId()}/comments`)
            .expect(HTTP_CODES.NOT_FOUND)

        console.log(res.body)
    })
})