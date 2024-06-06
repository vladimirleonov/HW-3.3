import {createUser} from "../../../helpers/user-helpers";
import {DetailedUserOutputType} from "../../../../src/features/users/input-output-types/user-types";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../../src/db/mongo-db";
import {testSeeder} from "../../../testSeeder";
import {authService} from "../../../../src/features/auth/services/authService";
import {Result} from "express-validator";
import {nodemailerService} from "../../../../src/common/adapters/nodemailerService";
import {emailServiceMock} from "../../../../src/common/email/emailServiceMock";
import {ResultStatus} from "../../../../src/common/types/result-type";

describe('User registration', () => {
    const registrationUserUseCase = authService.registrationUser
    // nodemailerService.sendEmail = emailServiceMock.sendEmail
    // nodemailerService.sendEmail = jest.fn()// just function, but not returns anything
    nodemailerService.sendEmail = jest.fn().mockImplementation(async (recipient: string, emailTemplate: string): Promise<boolean> => true)

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
    it('should register user with correct data ', async () => {
        const registerUserData = testSeeder.createUserDTO()

        const result = await registrationUserUseCase(registerUserData)

        expect(result.status).toBe(ResultStatus.Success)
        //check user data

        expect(nodemailerService.sendEmail).toBeCalled()
        expect(nodemailerService.sendEmail).toBeCalledTimes(1)
    });
    // it.skip('+ DELETE user with correct input data: STATUS 204', async () => {
    //     const user: DetailedUserOutputType = await createUser()
    //
    //     await req
    //         .delete(`${SETTINGS.PATH.USERS}/${user.id}`)
    //         .set('authorization', `Basic ${base64Service.encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
    //         .expect(HTTP_CODES.NO_CONTENT)
    // })
});