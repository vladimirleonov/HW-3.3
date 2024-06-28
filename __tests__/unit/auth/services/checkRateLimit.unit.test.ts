import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../../src/db/mongo-db";
import {securityService} from "../../../../src/features/security/services/securityService";
import {ResultStatus} from "../../../../src/common/types/result";
import {Result} from "../../../../src/common/types/result";

describe('Check RateLimit', () => {
    const checkRateLimitUseCase = securityService.checkRateLimit

    const ips: string[] = ['10.0.0.1', '10.0.0.2']
    const originUrls = ['auth/registration', 'auth/login', 'auth/refresh-token']

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
    it('should check rate limit success for less then 5 from one ip', async () => {
        for (let i: number = 0; i < 4; i++) {
            const result: Result = await checkRateLimitUseCase({ip: ips[0], originUrl: originUrls[0]})
            expect(result.status).toBe(ResultStatus.Success)
        }
        for (let i: number = 0; i < 4; i++) {
            const result: Result = await checkRateLimitUseCase({ip: ips[1], originUrl: originUrls[1]})
            expect(result.status).toBe(ResultStatus.Success)
        }
    })
    it('should check rate limit tooManyRequests for 5 and more requests from one ip', async () => {
        for (let i: number = 0; i < 5; i++) {
            const result: Result = await checkRateLimitUseCase({ip: ips[0], originUrl: originUrls[0]})
            expect(result.status).toBe(ResultStatus.Success)
        }
        for (let i: number = 0; i < 6; i++) {
            const result: Result = await checkRateLimitUseCase({ip: ips[1], originUrl: originUrls[1]})
            if (i >= 5) {
                console.log(i)
                expect(result.status).toBe(ResultStatus.TooManyRequests)
            } else {
                expect(result.status).toBe(ResultStatus.Success)
            }
        }
    })
})