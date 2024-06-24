import {userDeviceMongoRepository} from "../repository/userDeviceMongoRepository";
import {Result, ResultStatus} from "../../../common/types/result";
import {UserDeviceDBType} from "../../../db/db-types/user-devices-db-types";
import {apiAccessLogsMongoRepository} from "../../auth/repository/apiAccessLogsMongoRepository";
import {
    CheckRateLimitInputServiceType,
    TerminateAllOtherDeviceSessionsInputServiceType,
    TerminateDeviceSessionInputServiceType
} from "../types/inputTypes/securityInputServiceTypes";

export const securityService = {
    async terminateAllOtherDeviceSessions({
                                              deviceId,
                                              userId
                                          }: TerminateAllOtherDeviceSessionsInputServiceType): Promise<Result> {
        await userDeviceMongoRepository.deleteAllOtherByDeviceIdAndUserId({deviceId, userId})
        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async terminateDeviceSession({deviceId, userId}: TerminateDeviceSessionInputServiceType): Promise<Result> {
        const device: UserDeviceDBType | null = await userDeviceMongoRepository.findByDeviceId(deviceId)
        if (!device) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'deviceId', message: `Device with deviceId ${deviceId} does not exist`}],
                data: null
            }
        }

        if (device.userId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                extensions: [{field: 'deviceId', message: `You do not have permission to delete it`}],
                data: null
            }
        }

        await userDeviceMongoRepository.deleteOneByDeviceIdAndUserId({deviceId, userId})

        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async checkRateLimit({ip, originUrl}: CheckRateLimitInputServiceType): Promise<Result> {
        const accessLogsCount: number = await apiAccessLogsMongoRepository.countApiAccessLogsByIpAndOriginUrl({
            ip,
            originUrl
        })
        if (accessLogsCount >= 5) {
            return {
                status: ResultStatus.TooManyRequests,
                extensions: [{field: 'requests', message: `Too many requests`}],
                data: null
            }
        }

        await apiAccessLogsMongoRepository.createApiAccessLog({ip, originUrl})

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
}