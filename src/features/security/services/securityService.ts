import {userDeviceMongoRepository} from "../repository/userDeviceMongoRepository";
import {Result, ResultStatus} from "../../../common/types/result";
import {WithId} from "mongodb";
import {UserDeviceDBType} from "../../../db/db-types/user-devices-db-types";
import {apiAccessLogsRepository} from "../../auth/repository/apiAccessLogsRepository";

export const securityService = {
    async terminateDevicesExcludedCurrent({deviceId, userId}: { deviceId: string, userId: string }): Promise<Result> {
        await userDeviceMongoRepository.deleteExcludedCurrent({deviceId, userId})
        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async deleteDevice({deviceId, userId}: { deviceId: string, userId: string }): Promise<Result> {
        const device: WithId<UserDeviceDBType> | null = await userDeviceMongoRepository.findByDeviceId(deviceId)
        if(!device) {
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

        await userDeviceMongoRepository.deleteByDeviceIdAndUserId({deviceId, userId})
        return {
            status: ResultStatus.Success,
            data: null
        }
    },
    async checkRateLimit({ip, originUrl}: {ip: string, originUrl: string}): Promise<Result> {
        const accessLogsCount: number = await apiAccessLogsRepository.countApiLogsByIpAndOriginUrl({ip, originUrl})
        console.log("accessLogsCount", accessLogsCount)
        if (accessLogsCount >= 5) {
            return {
                status: ResultStatus.TooManyRequests,
                extensions: [{field: 'requests', message: `Too many requests`}],
                data: null
            }
        }

        console.log("create access log")
        await apiAccessLogsRepository.createApiAccessLog({ip, originUrl})

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    // async checkRateLimit({ ip, originUrl }: { ip: string; originUrl: string }): Promise<Result> {
    //     const accessLogsCount: number = await apiAccessLogsRepository.countApiLogsByIpAndOriginUrl({ ip, originUrl });
    //     if (accessLogsCount >= 5) {
    //         return {
    //             status: ResultStatus.TooManyRequests,
    //             extensions: [{ field: "requests", message: `Too many requests` }],
    //             data: null
    //         };
    //     }
    //
    //     await apiAccessLogsRepository.createApiAccessLog({ ip, originUrl });
    //     return {
    //         status: ResultStatus.Success,
    //         data: null
    //     };
    // }
}