import {req} from "../../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../../src/settings"
import {encodeToBase64} from "../../../../src/common/helpers/auth-helpers"
import {ObjectId} from "mongodb"
import {OutputUserType} from "../../../../src/features/users/input-output-types/user-types";
import {createUser} from "../../../helpers/user-helpers";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../../src/db/mongo-db";

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