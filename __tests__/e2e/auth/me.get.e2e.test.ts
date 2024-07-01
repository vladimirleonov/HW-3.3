import {req} from "../../helpers/req"
import {SETTINGS} from "../../../src/settings"
import {HTTP_CODES} from "../../../src/settings"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongo-driver-db-connection"
import {loginUser} from "../helpers/auth-helpers"
import {LoginOutputControllerType} from "../../../src/features/auth/types/outputTypes/authOutputControllersTypes";

describe('AUTH /me', () => {
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
    it('+ GET aut me : STATUS 200', async () => {
        const authData: LoginOutputControllerType = await loginUser()

        await req.get(`${SETTINGS.PATH.AUTH}/me`)
            .set('authorization', `Bearer ${authData.accessToken}`)
            .send()
            .expect(HTTP_CODES.OK)
    })
})