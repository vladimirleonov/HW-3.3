import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../../src/db/mongoose-db-connection";
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
import {
    LogoutInputServiceType,
    RefreshTokenInputServiceType
} from "../../../../src/features/auth/types/inputTypes/authInputServiceTypes";
import {JwtPayload} from "jsonwebtoken";
import {jwtAdapter} from "../../../../src/common/adapters/jwt.adapter";
import {unixToISOString} from "../../../../src/common/helpers/unixToISOString";

describe('User auth', () => {
    const registrationUserUseCase = authService.registration
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
        console.log(result)
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
    it(`should not resend email registration, user with email doesn't exist`, async () => {
        const result: Result = await registrationEmailResendingUseCase({email: 'qwerty@gmail.com'})

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

    const ip: string = '103.12.64.107'
    const deviceName: string = 'Mozilla/5.0'
    const refreshToken: string = 'fakeToken'

    const login: string = 'test12ada'
    const email: string = 'test12adasd@gmail.com'
    const password: string = 'testtest1234'

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
        await testSeeder.registerUser(
            login,
            email,
            password,
            undefined,
            undefined,
            true
        )

        const userToLogin = {
            loginOrEmail: email,
            password: password,
            ip: ip,
            deviceName: deviceName,
            refreshToken: refreshToken
        }

        const result: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin)

        expect(result.status).toBe(ResultStatus.Success)
    });
    it('should not login user with correct refresh token. User should log out first!', async () => {
        await testSeeder.registerUser(
            login,
            email,
            password,
            undefined,
            undefined,
            true
        )

        const userToLogin_1 = {
            loginOrEmail: email,
            password: password,
            ip: ip,
            deviceName: deviceName,
            refreshToken: refreshToken
        }

        const loginResult_1: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin_1)

        const userToLogin_2 = {
            loginOrEmail: email,
            password: password,
            ip: ip,
            deviceName: deviceName,
            refreshToken: loginResult_1.data!.refreshToken
        }

        const loginResult_2: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin_2)

        expect(loginResult_2.status).toBe(ResultStatus.BadRequest)
    });
    it('should not login user not found by login', async () => {
        const userToLogin = {
            loginOrEmail: email,
            password: password,
            ip: ip,
            deviceName: deviceName,
            refreshToken: refreshToken
        }

        const result: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin)

        expect(result.status).toBe(ResultStatus.BadRequest)
    });
    it('should not login user not confirmed', async () => {
        await testSeeder.registerUser(
            login,
            email,
            password,
            undefined,
            undefined,
            false
        )

        const userToLogin = {
            loginOrEmail: email,
            password: password,
            ip: ip,
            deviceName: deviceName,
            refreshToken: refreshToken
        }

        const result: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin)

        expect(result.status).toBe(ResultStatus.BadRequest)
    });
});

describe('Refresh token', () => {
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
    it('should return unauthorized, device session not found', async () => {
        const deviceId: string = '123'
        const userId: string = '123'
        const iat: string = '123'

        const result: Result<RefreshTokenOutputServiceType | null> = await refreshTokenUseCase({deviceId, userId, iat})

        expect(result.status).toBe(ResultStatus.Unauthorized)
    })
    it('should successfully refresh token', async () => {
        const ip: string = '103.12.64.107'
        const deviceName: string = 'Mozilla/5.0'
        const refreshToken: string = 'fakeToken'

        const login: string = 'test12ada'
        const email: string = 'test12adasd@gmail.com'
        const password: string = 'testtest1234'

        const user = await testSeeder.registerUser(
            login,
            email,
            password,
            undefined,
            undefined,
            true
        )

        const userToLogin = {
            loginOrEmail: email,
            password: password,
            ip,
            deviceName,
            refreshToken
        }

        const loginResult: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin)
        expect(loginResult.status).toBe(ResultStatus.Success)

        const decodedRefreshToken: string | JwtPayload | null = jwtAdapter.decode(loginResult.data!.refreshToken)

        const {iat, deviceId, userId} = decodedRefreshToken as JwtPayload

        const refreshTokenInputServiceType: RefreshTokenInputServiceType = {
            deviceId,
            userId,
            iat: unixToISOString(iat)
        }

        const refreshTokenResult: Result<RefreshTokenOutputServiceType | null> = await refreshTokenUseCase(refreshTokenInputServiceType)
        expect(refreshTokenResult.status).toBe(ResultStatus.Success)
    })
})

describe('logout', () => {
    const ip: string = '103.12.64.107'
    const deviceName: string = 'Mozilla/5.0'
    const refreshToken: string = 'fakeToken'

    const login: string = 'test12ada'
    const email: string = 'test12adasd@gmail.com'
    const password: string = 'testtest1234'

    const logoutUserUseCase = authService.logout
    const loginUserUseCase = authService.login
    const refreshTokenUseCase = authService.refreshToken

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
    it('should successfully logout', async () => {
        await testSeeder.registerUser(
            login,
            email,
            password,
            undefined,
            undefined,
            true
        )

        const userToLogin = {
            loginOrEmail: email,
            password: password,
            ip: ip,
            deviceName: deviceName,
            refreshToken: refreshToken
        }

        const loginResult: Result<LoginOutputServiceType | null> = await loginUserUseCase(userToLogin)
        expect(loginResult.status).toBe(ResultStatus.Success)

        const decodedRefreshToken: string | JwtPayload | null = jwtAdapter.decode(loginResult.data!.refreshToken)

        const {iat, deviceId} = decodedRefreshToken as JwtPayload

        const logoutInput: LogoutInputServiceType = {
            deviceId,
            iat: unixToISOString(iat)
        }

        const logoutResult: Result = await logoutUserUseCase(logoutInput)
        expect(logoutResult.status).toBe(ResultStatus.Success)
    })
    it('should not logout device, deviceId and iat does not exist', async () => {
        const logoutResult: Result = await logoutUserUseCase({deviceId: '123', iat: '123'})
        expect(logoutResult.status).toBe(ResultStatus.Unauthorized)
    })
})