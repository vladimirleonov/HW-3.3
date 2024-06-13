import {db} from "../../../../src/db/mongo-db";
import {MongoMemoryServer} from "mongodb-memory-server";
import {authService} from "../../../../src/features/auth/services/authService";
import {ResultStatus} from "../../../../src/common/types/result";
import {JwtPayloadCustomType} from "../../../../src/common/types/jwtPayloadType";
import {Result} from "../../../../src/common/types/result";
import {bearerAdapter} from "../../../../src/common/adapters/bearer.adapter";
import {userMongoRepository} from "../../../../src/features/users/repository/userMongoRepository";

describe('Check Access Token', () => {
    const checkAccessTokenUseCase = authService.checkAccessToken

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
    it('should not verify header not provided', async () => {
        const result: Result<JwtPayloadCustomType | null> = await checkAccessTokenUseCase("")

        expect(result.status).toBe(ResultStatus.Unauthorized)
    })
    it('should not verify no Bearer provided in header', async () => {
        const result: Result<JwtPayloadCustomType | null> = await checkAccessTokenUseCase("Adasdygbqe adsf qrgf")

        expect(result.status).toBe(ResultStatus.Unauthorized)
    })
    it('should not verify access token not provided in authorization header', async () => {
        const result: Result<JwtPayloadCustomType | null> = await checkAccessTokenUseCase("Bearer")

        expect(result.status).toBe(ResultStatus.Unauthorized)
    })
    it('should not verify in bearerAdapter', async () => {
        bearerAdapter.verifyToken = jest.fn().mockImplementation(async (token: string) => null)

        const result: Result<JwtPayloadCustomType | null> = await checkAccessTokenUseCase("Bearer jkashdfafqeoprwejad")

        expect(result.status).toBe(ResultStatus.Unauthorized)
        expect(bearerAdapter.verifyToken).toHaveBeenCalledTimes(1)
    })
    it('should not verify in userRepository', async () => {
        bearerAdapter.verifyToken = jest.fn().mockImplementation(async (token: string) => ({userId: '234878ca6713be81a'}))
        userMongoRepository.findUserById = jest.fn().mockImplementation(async (userId: string): Promise<null> => null)

        const result: Result<JwtPayloadCustomType | null> = await checkAccessTokenUseCase("Bearer jkashdfafqeoprwejad")

        expect(result.status).toBe(ResultStatus.Unauthorized)
        expect(bearerAdapter.verifyToken).toHaveBeenCalledTimes(1)
        expect(userMongoRepository.findUserById).toHaveBeenCalledTimes(1)
    })
    it('should verify user', async () => {
        bearerAdapter.verifyToken = jest.fn().mockImplementation(async (token: string) => ({userId: '234878ca6713be81a'}))
        userMongoRepository.findUserById = jest.fn().mockImplementation(async (userId: string) => {
            return {
                id: "666a100906c35b487bd2efbf",
                login: "lg-952714",
                email: "email952714@gg.com",
                createdAt: "2024-06-12T21:15:53.496Z",
                emailConfirmation: {
                    confirmationCode: "eee1e21f-f834-45a3-a097-0c65d3165521",
                    expirationDate: "2024-06-12T21:15:53.496Z",
                    isConfirmed: true
                }
            }
        })

        const result: Result<JwtPayloadCustomType | null> = await checkAccessTokenUseCase("Bearer jkashdfafqeoprwejad")

        expect(result.status).toBe(ResultStatus.Success)
        expect(result.data).toEqual({ userId: '234878ca6713be81a' })

        expect(bearerAdapter.verifyToken).toHaveBeenCalledTimes(1)
        expect(userMongoRepository.findUserById).toHaveBeenCalledTimes(1)
        expect(userMongoRepository.findUserById).toHaveBeenCalledWith('234878ca6713be81a');
    })
})