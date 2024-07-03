import {authService} from "../../../../src/features/auth/services/authService";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../../src/db/mongoose-db-connection";
import {testSeeder} from "../../../testSeeder";
import {Result, ResultStatus} from "../../../../src/common/types/result";
import {
    LoginOutputServiceType,
    RefreshTokenOutputServiceType
} from "../../../../src/features/auth/types/outputTypes/authOutputServiceTypes";
import {jwtAdapter} from "../../../../src/common/adapters/jwt.adapter";
import {JwtPayload} from "jsonwebtoken";
import {RefreshTokenInputServiceType} from "../../../../src/features/auth/types/inputTypes/authInputServiceTypes";
import {unixToISOString} from "../../../../src/common/helpers/unixToISOString";
import {UserDeviceDBType} from "../../../../src/db/models/devices.model";
import {securityService} from "../../../../src/features/security/services/securityService";
import {WithId} from "mongodb";

// chain actions (after each test change local variables)
// 1) login 4 user
// 2) update refreshToken for device 1
// 3) delete device 2
// 4) log out device 3
// 5) delete all devices exclude current device 1
// 6) check errors

describe('Security service test logic chain', () => {
    const loginUserUseCase = authService.login
    const refreshTokenUseCase = authService.refreshToken
    const logOutUseCase = authService.logout

    const terminateDeviceSessionUseCase = securityService.terminateDeviceSession
    const terminateAllOtherDeviceSessionsUseCase = securityService.terminateAllOtherDeviceSessions

    let refreshToken1: string, refreshToken2: string, refreshToken3: string, refreshToken4: string
    let deviceArr: Array<UserDeviceDBType> = []
    const ip: string = '103.12.64.107'

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
        //await db.drop()
        //jest.resetAllMocks()
    })
    it('should login 4 user with correct data', async () => {
        await testSeeder.registerUser(
            login,
            email,
            password,
            undefined,
            undefined,
            true
        )

        const userAgents = [
            'Chrome/114.0.5735.198',
            'Firefox/102.0',
            'Safari/605.1.15',
            'Edg/91.0.864.67'
        ];

        const loginResults: Result<LoginOutputServiceType | null>[] = await Promise.all(userAgents.map(userAgent =>
            loginUserUseCase({
                loginOrEmail: email,
                password: password,
                ip: ip,
                deviceName: userAgent,
                refreshToken: 'asdfdfqeqw'
            })
        ))

        expect(loginResults[0].status).toEqual(ResultStatus.Success)
        expect(loginResults[1].status).toEqual(ResultStatus.Success)
        expect(loginResults[2].status).toEqual(ResultStatus.Success)
        expect(loginResults[3].status).toEqual(ResultStatus.Success)

        refreshToken1 = loginResults[0].data!.refreshToken;
        refreshToken2 = loginResults[1].data!.refreshToken;
        refreshToken3 = loginResults[2].data!.refreshToken;
        refreshToken4 = loginResults[3].data!.refreshToken;

        loginResults.forEach(result =>
            expect(result.status).toEqual(ResultStatus.Success)
        )

        const devicesBeforeUpdate: Array<UserDeviceDBType> = await testSeeder.getDevices()
        devicesBeforeUpdate.forEach((device: UserDeviceDBType) => deviceArr.push(device))
    })
    it('should update refreshToken for device 1', async () => {
        ///
        // refresh token 1
        ///
        const decodedRefreshToken: string | JwtPayload | null = jwtAdapter.decode(refreshToken1)
        console.log("decodedRefreshToken", decodedRefreshToken)
        const {iat, deviceId, userId} = decodedRefreshToken as JwtPayload
        const refreshTokenInputServiceType: RefreshTokenInputServiceType = {
            deviceId,
            userId,
            iat: unixToISOString(iat)
        }

        const refreshToken1BeforeUpdate: string = refreshToken1
        console.log("refreshToken1BeforeUpdate", refreshToken1BeforeUpdate)

        //delay before update refresh token to get different iat
        await new Promise(resolve => setTimeout(resolve, 2000));

        const refreshTokenResult: Result<RefreshTokenOutputServiceType | null> = await refreshTokenUseCase(refreshTokenInputServiceType)
        refreshToken1 = refreshTokenResult.data!.refreshToken
        console.log("refreshTokenResult", refreshTokenResult)

        expect(refreshTokenResult.status).toBe(ResultStatus.Success)
        expect(refreshTokenResult.data!.refreshToken).not.toBe(refreshToken1BeforeUpdate)

        ////
        // check iat in devices (iat for device id should be updates)
        ///
        const devices: Array<UserDeviceDBType> = await testSeeder.getDevices()

        expect(deviceArr.length).toBe(devices.length)

        console.log("devices[0]", devices[0])
        console.log("deviceArr[0]", deviceArr[0])

        expect(devices[0].iat).not.toBe(deviceArr[0].iat)
        expect(devices[1].iat).toBe(deviceArr[1].iat)
        expect(devices[2].iat).toBe(deviceArr[2].iat)
        expect(devices[3].iat).toBe(deviceArr[3].iat)

        deviceArr[0].iat = devices[0].iat
    })
    it('should delete device 2', async () => {
        const elementIndexToDelete: number = 1

        const {deviceId, userId} = deviceArr[elementIndexToDelete]
        const result: Result = await terminateDeviceSessionUseCase({deviceId, userId})
        expect(result.status).toBe(ResultStatus.Success)

        deviceArr.splice(elementIndexToDelete, 1)
        const devices: WithId<UserDeviceDBType>[] = await testSeeder.getDevices()
        expect(devices.length).toBe(deviceArr.length)
    })
    it('should log out device 3', async () => {
        const elementIndexToDelete: number = 2

        const {deviceId, iat} = deviceArr[elementIndexToDelete]
        const result: Result = await logOutUseCase({deviceId, iat})
        expect(result.status).toBe(ResultStatus.Success)

        deviceArr.splice(elementIndexToDelete, 1)
        const devices: WithId<UserDeviceDBType>[] = await testSeeder.getDevices()
        expect(devices.length).toBe(deviceArr.length)
        expect(devices).toEqual(deviceArr)
    })
    it('should delete all devices exclude current device 1', async () => {
        const currentDeviceIndex: number = 1

        const {deviceId, userId} = deviceArr[currentDeviceIndex]
        const result: Result = await terminateAllOtherDeviceSessionsUseCase({deviceId, userId})
        expect(result.status).toBe(ResultStatus.Success)

        const newDeviceArr: UserDeviceDBType[] = deviceArr.slice(currentDeviceIndex, currentDeviceIndex + 1)
        deviceArr = newDeviceArr;
        const devices: Array<UserDeviceDBType> = await testSeeder.getDevices()
        expect(deviceArr.length).toEqual(devices.length)
        expect(deviceArr).toEqual(devices)
    })
    // check errors
    it('should not delete device invalid deviceId', async () => {
        const {deviceId, userId} = deviceArr[0]
        const result: Result = await terminateDeviceSessionUseCase({deviceId: '123', userId})
        expect(result.status).toBe(ResultStatus.NotFound)
    })
    it('should not delete device invalid deviceId', async () => {
        const {deviceId, userId} = deviceArr[0]
        const result: Result = await terminateDeviceSessionUseCase({deviceId, userId: '123'})
        expect(result.status).toBe(ResultStatus.Forbidden)
    })
});