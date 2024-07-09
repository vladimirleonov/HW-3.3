import {UserDeviceMongoRepository} from "../repository/userDeviceMongoRepository"
import {Result, ResultStatus} from "../../../common/types/result"
import {
    ApiAccessLogsMongoRepository
} from "../../auth/repository/apiAccessLogsMongoRepository"
import {
    CheckRateLimitInputServiceType,
    TerminateAllOtherDeviceSessionsInputServiceType,
    TerminateDeviceSessionInputServiceType
} from "../types/inputTypes/securityInputServiceTypes"
import { ApiAccessLogModel } from "../../../db/models/apiAccessLog.model"
import {UserDevice} from "../../../db/db-types/user-devices-db-types";
import {ApiAccessLogDocument} from "../../../db/db-types/api-access-log-db-types";

export class SecurityService {
    userDeviceMongoRepository: UserDeviceMongoRepository
    apiAccessLogsMongoRepository: ApiAccessLogsMongoRepository
    constructor() {
        this.userDeviceMongoRepository = new UserDeviceMongoRepository()
        this.apiAccessLogsMongoRepository = new ApiAccessLogsMongoRepository()
    }
    async terminateAllOtherDeviceSessions({
                                            deviceId,
                                            userId
                                        }: TerminateAllOtherDeviceSessionsInputServiceType): Promise<Result> {
        await this.userDeviceMongoRepository.deleteAllOtherByDeviceIdAndUserId({deviceId, userId})
        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    async terminateDeviceSession({deviceId, userId}: TerminateDeviceSessionInputServiceType): Promise<Result> {
        const device: UserDevice | null = await this.userDeviceMongoRepository.findByDeviceId(deviceId)
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

        await this.userDeviceMongoRepository.deleteOneByDeviceIdAndUserId({deviceId, userId})

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
    async checkRateLimit({ip, originUrl}: CheckRateLimitInputServiceType): Promise<Result> {
        const accessLogsCount: number = await this.apiAccessLogsMongoRepository.countApiAccessLogsByIpAndOriginUrl({
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

        const newApiAccessLog: ApiAccessLogDocument = new ApiAccessLogModel({
            ip,
            URL: originUrl,
            date: new Date(),
        })

        await this.apiAccessLogsMongoRepository.save(newApiAccessLog)
        //await apiAccessLogsMongoRepository.createApiAccessLog({ip, originUrl})

        return {
            status: ResultStatus.Success,
            data: null
        }
    }
}





// export const securityService = {
//     async terminateAllOtherDeviceSessions({
//                                               deviceId,
//                                               userId
//                                           }: TerminateAllOtherDeviceSessionsInputServiceType): Promise<Result> {
//         await userDeviceMongoRepository.deleteAllOtherByDeviceIdAndUserId({deviceId, userId})
//         return {
//             status: ResultStatus.Success,
//             data: null
//         }
//     },
//     async terminateDeviceSession({deviceId, userId}: TerminateDeviceSessionInputServiceType): Promise<Result> {
//         const device: UserDevice | null = await userDeviceMongoRepository.findByDeviceId(deviceId)
//         if (!device) {
//             return {
//                 status: ResultStatus.NotFound,
//                 extensions: [{field: 'deviceId', message: `Device with deviceId ${deviceId} does not exist`}],
//                 data: null
//             }
//         }
//
//         if (device.userId !== userId) {
//             return {
//                 status: ResultStatus.Forbidden,
//                 extensions: [{field: 'deviceId', message: `You do not have permission to delete it`}],
//                 data: null
//             }
//         }
//
//         await userDeviceMongoRepository.deleteOneByDeviceIdAndUserId({deviceId, userId})
//
//         return {
//             status: ResultStatus.Success,
//             data: null
//         }
//     },
//     async checkRateLimit({ip, originUrl}: CheckRateLimitInputServiceType): Promise<Result> {
//         const accessLogsCount: number = await apiAccessLogsMongoRepository.countApiAccessLogsByIpAndOriginUrl({
//             ip,
//             originUrl
//         })
//
//         if (accessLogsCount >= 5) {
//             return {
//                 status: ResultStatus.TooManyRequests,
//                 extensions: [{field: 'requests', message: `Too many requests`}],
//                 data: null
//             }
//         }
//
//         const newApiAccessLog: ApiAccessLogDocument = new ApiAccessLogModel({
//             ip,
//             URL: originUrl,
//             date: new Date(),
//         })
//
//         await apiAccessLogsMongoRepository.save(newApiAccessLog)
//         //await apiAccessLogsMongoRepository.createApiAccessLog({ip, originUrl})
//
//         return {
//             status: ResultStatus.Success,
//             data: null
//         }
//     }
// }