import {db} from "../../../../src/db/mongo-db";
import {MongoMemoryServer} from "mongodb-memory-server";
import {authService} from "../../../../src/features/auth/services/authService";
import {ResultStatus} from "../../../../src/common/types/result";
import {Result} from "../../../../src/common/types/result";
import {userMongoRepository} from "../../../../src/features/users/repository/userMongoRepository";
import {JwtPayload} from "jsonwebtoken";
import {jwtAdapter} from "../../../../src/common/adapters/jwt.adapter";

describe('Check Refresh Token', () => {
    const checkRefreshTokenUseCase = authService.checkRefreshToken

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
    it('should not verify refresh token', async () => {
        jwtAdapter.verifyToken = jest.fn().mockImplementation(async (token: string) => null)

        const result: Result<JwtPayload | null> = await checkRefreshTokenUseCase("fsdqrtgjhfdszxcas")

        expect(result.status).toBe(ResultStatus.Unauthorized)
        expect(jwtAdapter.verifyToken).toHaveBeenCalledTimes(1)
    })
    it('should not verify in userRepository', async () => {
        jwtAdapter.verifyToken = jest.fn().mockImplementation((token: string) => ({ userId: '123', deviceId: '123', iat: 123 }));
        userMongoRepository.findUserById = jest.fn().mockImplementation(async (userId: string) => null);

        const result: Result<JwtPayload | null> = await checkRefreshTokenUseCase("jkashdfafqeoprwejad");

        expect(result.status).toBe(ResultStatus.Unauthorized);
        expect(jwtAdapter.verifyToken).toHaveBeenCalledTimes(1);
        expect(userMongoRepository.findUserById).toHaveBeenCalledTimes(1);
    })
    it('should verify user', async () => {
        jwtAdapter.verifyToken = jest.fn().mockImplementation((token: string) => ({ userId: '123', deviceId: '123', iat: '123' }));

        userMongoRepository.findUserById = jest.fn().mockImplementation(async (userId: string) => (
            {
                id: "666a100906c35b487bd2efbf",
                login: "lg-952714",
                email: "email952714@gg.com",
                createdAt: "2024-06-12T21:15:53.496Z",
                emailConfirmation: {
                    confirmationCode: "eee1e21f-f834-45a3-a097-0c65d3165521",
                    expirationDate: "2024-06-12T21:15:53.496Z",
                    isConfirmed: true
                }
            })
        );

        const result: Result<JwtPayload | null> = await checkRefreshTokenUseCase("jkashdfafqeoprwejad")

        expect(result.status).toBe(ResultStatus.Success);
        expect(result.data).toEqual({ userId: '123', deviceId: '123', iat: '123' });

        expect(jwtAdapter.verifyToken).toHaveBeenCalledTimes(1);
        expect(userMongoRepository.findUserById).toHaveBeenCalledTimes(1);
    });
})