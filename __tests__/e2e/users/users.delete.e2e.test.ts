import {req} from "../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../src/settings"
import {base64Adapter} from "../../../src/common/adapters/base64.adapter"
import {ObjectId} from "mongodb"
import {DetailedUserOutputType} from "../../../src/features/users/input-output-types/user-types"
import {createUser} from "../helpers/user-helpers"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongoose-db-connection"

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
        const user: DetailedUserOutputType = await createUser()

        await req
            .delete(`${SETTINGS.PATH.USERS}/${user.id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE user with incorrect input id: STATUS 404', async () => {
        await req
            .delete(`${SETTINGS.PATH.USERS}/${new ObjectId()}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
    it('+ DELETE user with correct input data: STATUS 204', async () => {
        const user: DetailedUserOutputType = await createUser()

        await req
            .delete(`${SETTINGS.PATH.USERS}/${user.id}`)
            .set('authorization', `Basic ${base64Adapter.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
})