import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../../src/db/mongo-db";
import {testSeeder} from "../../../testSeeder";
import {authService} from "../../../../src/features/auth/services/authService";
import {nodemailerService} from "../../../../src/common/adapters/nodemailerService";
import {ResultStatus} from "../../../../src/common/types/result-type";
import {userMongoRepository} from "../../../../src/features/users/repository/userMongoRepository";
import {randomUUID} from "node:crypto";
import {Result} from "../../../../src/common/types/result-type";


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
        jest.resetAllMocks()
    })
    it('should register user with correct data', async () => {
        const userDTO = testSeeder.createUserDTO()

        const result: Result = await registrationUserUseCase(userDTO)

        expect(result.status).toBe(ResultStatus.Success)
        expect(result.data).toBeNull()

        expect(nodemailerService.sendEmail).toHaveBeenCalled()
        expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1)
    });
    it('should not register user twice', async () => {
        const userDTO = testSeeder.createUserDTO()

        await testSeeder.registerUser('test2', userDTO.email, 'qwerty')

        await userMongoRepository.findUserByEmail(userDTO.email);

        const result: Result = await registrationUserUseCase(userDTO)

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()

        expect(nodemailerService.sendEmail).not.toHaveBeenCalled()
    });
});



describe('User login', () => {
    const loginUserUseCase = authService.login

    beforeAll(async () => {
        const mongoServer: MongoMemoryServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })
    afterAll(async () => {
        await db.stop()
    })
    beforeEach(async () => {
        await db.drop()
        jest.resetAllMocks()
    })
    it('should login user with correct data', async () => {
        const user = await testSeeder.registerUser(
            'test123411',
            'test12adasd@gmail.com',
            'testtest1234',
            undefined,
            undefined,
            true
        )

        const userToLogin = {
            loginOrEmail: 'test12adasd@gmail.com',
            password: 'testtest1234'
        }

        const result: Result<string | null> = await loginUserUseCase(userToLogin)

        expect(result.status).toBe(ResultStatus.Success)
    });
    it('should not login user not confirmed', async () => {
        const user = await testSeeder.registerUser(
            'test1234',
            'test@gmail.com',
            'testtest1234'
        )

        const result: Result<string | null> = await loginUserUseCase({loginOrEmail: user.login, password: user.password})

        expect(result.status).toBe(ResultStatus.BadRequest)
    });
    it('should not login user does not exist', async () => {
        const userToLogin = {
            loginOrEmail: 'test1234',
            password: 'testtest1234'
        }

        const result: Result<string | null> = await loginUserUseCase(userToLogin)

        expect(result.status).toBe(ResultStatus.BadRequest)
    });
});



describe('Confirm email', () => {
    const confirmRegistrationUseCase = authService.confirmRegistration

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
    it('should not confirm email if user does not exist', async () => {
        const result: Result<boolean | null> = await confirmRegistrationUseCase({code: '123'})

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()
    });
    it('should not confirm email if confirmation code has expired', async () => {
        const user = await testSeeder.registerUser(
            'test',
            'test@gmail.com',
            'test1234',
            randomUUID(),
            new Date().toISOString()
        )

        const result: Result<boolean | null> = await confirmRegistrationUseCase({code: user.emailConfirmation.confirmationCode})

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()
    });
    it('should not confirm email if user account already confirmed', async () => {
        const user = await testSeeder.registerUser(
            'test',
            'test@gmail.com',
            'test1234',
            randomUUID(),
            undefined,
            true
        )

        const result: Result<boolean | null> = await confirmRegistrationUseCase({code: user.emailConfirmation.confirmationCode})

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()
    });
    it('should confirm email', async () => {
        const user = await testSeeder.registerUser(
            'test',
            'test@gmail.com',
            'test1234',
        )

        const result: Result<boolean | null> = await confirmRegistrationUseCase({code: user.emailConfirmation.confirmationCode})

        expect(result.status).toBe(ResultStatus.Success)
        expect(result.data).toBeTruthy()
    });
})



describe('User registration email resending', () => {
    const registrationEmailResendingUseCase = authService.registrationEmailResending
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
    it('should not resend email registration', async () => {
        const result: Result = await registrationEmailResendingUseCase({email: 'qwerty@gmail.com'})

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()

        expect(nodemailerService.sendEmail).not.toHaveBeenCalled()
    });
    it('should not resend email registration if email already confirmed', async () => {
        const user = await testSeeder.registerUser(
            'test',
            'test@gmail.com',
            'test1234',
            '1234567890',
            undefined,
            true
        )

        const result: Result = await registrationEmailResendingUseCase({email: user.email})

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()

        expect(nodemailerService.sendEmail).not.toHaveBeenCalled()
    });
    it('should confirm registration', async () => {
        const user = await testSeeder.registerUser(
            'test',
            'test@gmail.com',
            'test1234',
        )

        const result: Result = await registrationEmailResendingUseCase({email: user.email})

        expect(result.status).toBe(ResultStatus.Success)
        expect(result.data).toBeNull()

        expect(nodemailerService.sendEmail).toHaveBeenCalled()
    });
})