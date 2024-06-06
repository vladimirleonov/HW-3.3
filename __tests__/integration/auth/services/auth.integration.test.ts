import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../../src/db/mongo-db";
import {testSeeder} from "../../../testSeeder";
import {authService} from "../../../../src/features/auth/services/authService";
import {nodemailerService} from "../../../../src/common/adapters/nodemailerService";
import {ResultStatus} from "../../../../src/common/types/result-type";
import {userMongoRepository} from "../../../../src/features/users/repository/userMongoRepository";


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

        const result = await registrationUserUseCase(userDTO)

        expect(result.status).toBe(ResultStatus.Success)
        expect(result.data).toBeNull()

        expect(nodemailerService.sendEmail).toHaveBeenCalled()
        expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1)
    });
    it('should not register user twice', async () => {
        const userDTO = testSeeder.createUserDTO()

        await testSeeder.registerUser('test2', userDTO.email, 'qwerty')

        await userMongoRepository.findUserByLoginAndEmail('test2', userDTO.email);

        const result = await registrationUserUseCase(userDTO)

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()

        expect(nodemailerService.sendEmail).not.toHaveBeenCalled()
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
        const result = await confirmRegistrationUseCase({code: '123'})

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()
    });
    it('should not confirm email if confirmation code has expired', async () => {
        const user = await testSeeder.registerUser(
            'test',
            'test@gmail.com',
            'test1234',
            '1234567890',
            new Date().toISOString()
        )

        const result = await confirmRegistrationUseCase({code: user.emailConfirmation.confirmationCode})

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()
    });
    it('should not confirm email if user account already confirmed', async () => {
        const user = await testSeeder.registerUser(
            'test',
            'test@gmail.com',
            'test1234',
            '1234567890',
            '',
            true
        )

        const result = await confirmRegistrationUseCase({code: user.emailConfirmation.confirmationCode})

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()
    });
    it('should confirm email', async () => {
        const user = await testSeeder.registerUser(
            'test',
            'test@gmail.com',
            'test1234',
        )

        const result = await confirmRegistrationUseCase({code: user.emailConfirmation.confirmationCode})

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
        const result = await registrationEmailResendingUseCase({email: 'qwerty@gmail.com'})

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()

        expect(nodemailerService.sendEmail).not.toHaveBeenCalled()
    });
    it('should not resend email registration if email already confirmed', async () => {
        await testSeeder.registerUser(
            'test',
            'test@gmail.com',
            'test1234',
            '1234567890',
            '',
            true
        )

        const result = await registrationEmailResendingUseCase({email: 'test@gmail.com'})

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()

        expect(nodemailerService.sendEmail).not.toHaveBeenCalled()
    });
    it('should confirm registration', async () => {
        await testSeeder.registerUser(
            'test',
            'test@gmail.com',
            'test1234',
        )

        const result = await registrationEmailResendingUseCase({email: 'test@gmail.com'})

        expect(result.status).toBe(ResultStatus.Success)
        expect(result.data).toBeNull()

        expect(nodemailerService.sendEmail).toHaveBeenCalled()
    });
})