import {req} from "../../helpers/req"
import {SETTINGS} from "../../../src/settings"
import {HTTP_CODES} from "../../../src/settings"
import {MongoMemoryServer} from "mongodb-memory-server"
import {db} from "../../../src/db/mongoose-db-connection"
import {loginUser} from "../helpers/auth-helpers"

describe('AUTH /login', () => {
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
    it('+ POST login user: STATUS 200', async () => {
        await loginUser()
    })
    it('- POST loginOrEmail not passed : STATUS 400', async () => {
        const loginRes = await req.post(`${SETTINGS.PATH.AUTH}/login`)
            .send({
                password: 'test1234'
            }).expect(HTTP_CODES.BAD_REQUEST)

        expect(loginRes.body.errorsMessages[0]).toEqual({
            message: 'loginOrEmail is missing or not a string',
            field: 'loginOrEmail'
        })
    })
    it('- POST password is empty : STATUS 400', async () => {
        const loginRes = await req.post(`${SETTINGS.PATH.AUTH}/login`)
            .send({
                loginOrEmail: 'test1234',
                password: ''
            }).expect(HTTP_CODES.BAD_REQUEST)

        expect(loginRes.body.errorsMessages[0]).toEqual({
            message: 'password is less than 6 characters long',
            field: 'password'
        })
    })
})