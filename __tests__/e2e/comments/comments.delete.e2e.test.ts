import {req} from "../../helpers/req"
import {HTTP_CODES, SETTINGS} from "../../../src/settings"
import {
    CommentOutputType
} from "../../../src/features/comments/input-output-types/comment-types"
import {base64Adapter} from "../../../src/common/adapters/base64.adapter"
import {AUTH_DATA} from "../../../src/settings"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongoose-db-connection"
import {createPost} from "../helpers/post-helpers"
import {PostOutputType} from "../../../src/features/posts/input-output-types/post-types"
import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types"
import {createBlog} from "../helpers/blog-helpers"
import {loginUser} from "../helpers/auth-helpers"
import {LoginOutputControllerType} from "../../../src/features/auth/types/outputTypes/authOutputControllersTypes";
import {ObjectId} from "mongodb"
import {createComment} from "../helpers/comment-helpers"

describe('DELETE /comments', () => {
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
    it('+ DELETE comment with correct input data: STATUS 204', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const authData: LoginOutputControllerType = await loginUser()

        const comment: CommentOutputType = await createComment(postId, authData.accessToken)

        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Bearer ${authData.accessToken}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
    it('- DELETE comment unauthorized: STATUS 401', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const authData: LoginOutputControllerType = await loginUser()

        const comment: CommentOutputType = await createComment(postId, authData.accessToken)

        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Bearer adkafhjfkaskd`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE comment when content does not belongs to user: STATUS 403', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const authData: LoginOutputControllerType = await loginUser()

        const comment: CommentOutputType = await createComment(postId, authData.accessToken)

        await req.post(SETTINGS.PATH.USERS)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send({
                login: 'testtest1',
                email: 'testtest1@gmail.com',
                password: 'testtest1'
            }).expect(HTTP_CODES.CREATED)

        const loginRes = await req.post(`${SETTINGS.PATH.AUTH}/login`)
            .send({
                loginOrEmail: 'testtest1',
                password: 'testtest1'
            }).expect(HTTP_CODES.OK)


        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .set('authorization', `Bearer ${loginRes.body.accessToken}`)
            .expect(HTTP_CODES.FORBIDDEN)
    })
    it('- DELETE comment if comment with specified postId does not exist: STATUS 404', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const authData: LoginOutputControllerType = await loginUser()

        const comment: CommentOutputType = await createComment(postId, authData.accessToken)

        await req
            .delete(`${SETTINGS.PATH.COMMENTS}/${new ObjectId()}`)
            .set('authorization', `Bearer ${authData.accessToken}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
})