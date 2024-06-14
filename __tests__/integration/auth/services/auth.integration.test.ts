import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../../src/db/mongo-db";
import {testSeeder} from "../../../testSeeder";
import {authService} from "../../../../src/features/auth/services/authService";
import {nodemailerAdapter} from "../../../../src/common/adapters/nodemailer.adapter";
import {ResultStatus} from "../../../../src/common/types/result";
import {userMongoRepository} from "../../../../src/features/users/repository/userMongoRepository";
import {randomUUID} from "node:crypto";
import {Result} from "../../../../src/common/types/result";
import {
    LoginOutputServiceType,
    RefreshTokenOutputServiceType
} from "../../../../src/features/auth/types/outputTypes/authOutputServiceTypes";


describe('User registration', () => {
    const registrationUserUseCase = authService.registrationUser
    // nodemailerAdapter.sendEmail = nodemailerAdapterMock.sendEmail
    // nodemailerAdapter.sendEmail = jest.fn()// just function, but not returns anything
    nodemailerAdapter.sendEmail = jest.fn().mockImplementation(async (recipient: string, emailTemplate: string): Promise<boolean> => {
        return Promise.resolve(true);
    });

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

        expect(nodemailerAdapter.sendEmail).toHaveBeenCalled()
        expect(nodemailerAdapter.sendEmail).toHaveBeenCalledTimes(1)
    });
    it('should not register user twice', async () => {
        const userDTO = testSeeder.createUserDTO()

        await testSeeder.registerUser('test2', userDTO.email, 'qwerty')

        await userMongoRepository.findUserByEmail(userDTO.email);

        const result: Result = await registrationUserUseCase(userDTO)

        expect(result.status).toBe(ResultStatus.BadRequest)
        expect(result.data).toBeNull()

        expect(nodemailerAdapter.sendEmail).not.toHaveBeenCalled()
    });
});

describe('Confirm registration', () => {
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
    });
})

describe('User registration email resending', () => {
    const registrationEmailResendingUseCase = authService.registrationEmailResending
    nodemailerAdapter.sendEmail = jest.fn().mockImplementation(async (recipient: string, emailTemplate: string): Promise<boolean> => true)

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

        expect(nodemailerAdapter.sendEmail).not.toHaveBeenCalled()
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

        expect(nodemailerAdapter.sendEmail).not.toHaveBeenCalled()
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

        expect(nodemailerAdapter.sendEmail).toHaveBeenCalled()
    });
})

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

        const result: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin)

        expect(result.status).toBe(ResultStatus.Success)
    });
    it('should not login user not confirmed', async () => {
        const user = await testSeeder.registerUser(
            'test1234',
            'test@gmail.com',
            'testtest1234'
        )

        const result: Result<LoginOutputServiceType | null> = await loginUserUseCase({loginOrEmail: user.login, password: user.password})

        expect(result.status).toBe(ResultStatus.BadRequest)
    });
    it('should not login user does not exist', async () => {
        const userToLogin = {
            loginOrEmail: 'test1234',
            password: 'testtest1234'
        }

        const result: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin)

        expect(result.status).toBe(ResultStatus.BadRequest)
    });
});

describe('Refresh tokens', () => {
    const refreshTokenUseCase = authService.refreshToken
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
    it('should return unauthorized for an invalid token', async () => {
        const invalidToken: string = 'fajfjwqwhrfsnad'
        const result: Result<RefreshTokenOutputServiceType | null> = await refreshTokenUseCase(invalidToken)

        expect(result.status).toBe(ResultStatus.Unauthorized)
    })
    it('should return unauthorized for revoked token', async () => {
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

        const loginResult: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin)
        expect(loginResult.status).toBe(ResultStatus.Success)
        const refreshToken_1: string = loginResult.data!.refreshToken

        const refreshTokenResult_1: Result<RefreshTokenOutputServiceType | null> = await refreshTokenUseCase(refreshToken_1)
        expect(refreshTokenResult_1.status).toBe(ResultStatus.Success)
        const refreshToken_2 = refreshTokenResult_1.data!.refreshToken

        const secondRefreshTokenResult: Result<RefreshTokenOutputServiceType | null> = await refreshTokenUseCase(refreshToken_1)
        console.log(secondRefreshTokenResult)

        expect(secondRefreshTokenResult.status).toBe(ResultStatus.Unauthorized)
    })
    it('should successfully refresh token', async () => {
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

        const loginResult: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin)
        expect(loginResult.status).toBe(ResultStatus.Success)
        const refreshToken: string = loginResult.data!.refreshToken

        const refreshTokenResult: Result<RefreshTokenOutputServiceType | null> = await refreshTokenUseCase(refreshToken)
        expect(refreshTokenResult.status).toBe(ResultStatus.Success)
    })
})

