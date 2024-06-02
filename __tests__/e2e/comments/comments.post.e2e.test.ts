import {req} from "../../helpers/req"
import {HTTP_CODES, SETTINGS} from "../../../src/settings"
import {
    CommentBodyInputType
} from "../../../src/features/comments/input-output-types/comment-types"
import {base64Service} from "../../../src/common/adapters/base64Service";
import {AUTH_DATA} from "../../../src/settings"
import {testSeeder} from "../../testSeeder";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/mongo-db";
import {createPost} from "../../helpers/post-helpers";
import {PostOutputType} from "../../../src/features/posts/input-output-types/post-types";
import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types";
import {createBlog} from "../../helpers/blog-helpers";
import {loginUser} from "../../helpers/auth-helpers";
import {LoginOutputType} from "../../../src/features/auth/input-output-types/auth-types";

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
    it('- POST comment unauthorized: STATUS 401', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const newComment: CommentBodyInputType = testSeeder.createCommentDTO()

        await req
            .post(`${SETTINGS.PATH.POSTS}/${postId}/comments`)
            .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(newComment)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ POST comment with correct input data: STATUS 200', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const newComment: CommentBodyInputType = testSeeder.createCommentDTO()

        const authData: LoginOutputType = await loginUser()

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

        const authData: LoginOutputType = await loginUser()

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
})