import {req} from "../../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../../src/settings"
import {encodeToBase64} from "../../../../src/common/helpers/auth-helpers"
import {createBlogs} from "../../../helpers/dataset-helpers/blogsDatasets"
import {createPosts} from "../../../helpers/dataset-helpers/postsDatasets"
import {postCollection, blogCollection} from "../../../../src/db/mongo-db"
import {clearTestDB, connectToTestDB, closeTestDB} from "../../../test-db"
import {ObjectId} from "mongodb"
import {OutputUserType} from "../../../../src/features/users/input-output-types/user-types";
import {createUser, createUsers} from "../../../helpers/dataset-helpers/usersDatasets";

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
    it('- DELETE user unauthorized: STATUS 401', async () => {
        const user: OutputUserType = await createUser()

        await req
            .delete(`${SETTINGS.PATH.USERS}/${user.id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE user with incorrect input id: STATUS 404', async () => {
        await req
            .delete(`${SETTINGS.PATH.USERS}/${new ObjectId()}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
    it('+ DELETE user with correct input data: STATUS 204', async () => {
        const user: OutputUserType = await createUser()
        console.log(user.id)

        await req
            .delete(`${SETTINGS.PATH.USERS}/${user.id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
})