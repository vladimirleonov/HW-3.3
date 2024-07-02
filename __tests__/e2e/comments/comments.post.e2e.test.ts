import {req} from "../../helpers/req"
import {HTTP_CODES, SETTINGS} from "../../../src/settings"
import {
    CommentBodyInputType
} from "../../../src/features/comments/input-output-types/comment-types"
import {base64Adapter} from "../../../src/common/adapters/base64.adapter"
import {AUTH_DATA} from "../../../src/settings"
import {testSeeder} from "../../testSeeder"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongoose-db-connection"
import {createPost} from "../helpers/post-helpers"
import {PostOutputType} from "../../../src/features/posts/input-output-types/post-types"
import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types"
import {createBlog} from "../helpers/blog-helpers"
import {loginUser} from "../helpers/auth-helpers"
import {LoginOutputControllerType} from "../../../src/features/auth/types/outputTypes/authOutputControllersTypes";
import {ObjectId} from "mongodb"

describe('POST /comments', () => {
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
    it('+ POST comment with correct input data: STATUS 201', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const newComment: CommentBodyInputType = testSeeder.createCommentDTO()

        const authData: LoginOutputControllerType = await loginUser()

        await req
            .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set('authorization', `Bearer ${authData.accessToken}`)
            .send(newComment)
            .expect(HTTP_CODES.CREATED)
    })
    it('- POST comment when content must be more than 20 characters long: STATUS 400', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const newComment: CommentBodyInputType = {
            content: 'contentcontent'
        }

        const authData: LoginOutputControllerType = await loginUser()

        const res = await req
            .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set('authorization', `Bearer ${authData.accessToken}`)
            .send(newComment)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content must be more than 20 characters long'
            }
        )
    })
    it('- POST comment unauthorized: STATUS 401', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const newComment: CommentBodyInputType = testSeeder.createCommentDTO()

        await req
            .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(newComment)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- POST comment if post with specified postId does not exist: STATUS 404', async () => {
        const newComment: CommentBodyInputType = testSeeder.createCommentDTO()

        const authData: LoginOutputControllerType = await loginUser()

        await req
            .post(`${SETTINGS.PATH.POSTS}/${new ObjectId()}/comments`)
            .set('authorization', `Bearer ${authData.accessToken}`)
            .send(newComment)
            .expect(HTTP_CODES.NOT_FOUND)
    })
})