import {req} from "../../helpers/req"
import {HTTP_CODES, SETTINGS} from "../../../src/settings"
import {
    CommentOutputType
} from "../../../src/features/comments/input-output-types/comment-types"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongoose-db-connection"
import {createPost} from "../helpers/post-helpers"
import {PostOutputType} from "../../../src/features/posts/input-output-types/post-types"
import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types"
import {createBlog} from "../helpers/blog-helpers"
import {loginUser} from "../helpers/auth-helpers"
import {LoginOutputControllerType} from "../../../src/features/auth/types/outputTypes/authOutputControllersTypes";
import {createComment} from "../helpers/comment-helpers"
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
    it('+ GET comment by id: STATUS 200', async () => {
        const blog: BlogOutputType = await createBlog()
        const blogId: string = blog.id

        const post: PostOutputType = await createPost(blogId)
        const postId: string = post.id

        const authData: LoginOutputControllerType = await loginUser()

        const comment: CommentOutputType = await createComment(postId, authData.accessToken)

        await req
            .get(`${SETTINGS.PATH.COMMENTS}/${comment.id}`)
            .expect(HTTP_CODES.OK)
    })
    it('- GET comment not found: STATUS 404', async () => {
        await req
            .get(`${SETTINGS.PATH.COMMENTS}/${new ObjectId()}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
})