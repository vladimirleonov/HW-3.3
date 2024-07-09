import {UserDeviceModel} from "../../../db/models/devices.model"
import {findAllForOutputType} from "../../auth/types/outputTypes/userDeviceOutputMongoQueryRepositoryTypes"
import {UserDevice} from "../../../db/db-types/user-devices-db-types";

export class UserDeviceMongoQueryRepository {
    async findAllForOutput(userId: string): Promise<findAllForOutputType[]> {
        const userSessions: UserDevice[] = await UserDeviceModel.find({
            userId: userId
        })

        return userSessions.map((session: UserDevice) => this.mapToOutput(session))
    }
    mapToOutput({ip, deviceName, iat, deviceId, ...rest}: UserDevice): findAllForOutputType {
        return {
            ip,
            title: deviceName,
            lastActiveDate: iat,
            deviceId
        }
    }
}

// export const userDeviceMongoQueryRepository: UserDeviceMongoQueryRepository = new UserDeviceMongoQueryRepository()



// export const userDeviceMongoQueryRepository = {
//     async findAllForOutput(userId: string): Promise<findAllForOutputType[]> {
//         const userSessions: UserDevice[] = await UserDeviceModel.find({
//             userId: userId
//         })
//
//         return userSessions.map((session: UserDevice) => this.mapToOutput(session))
//     },
//     mapToOutput({ip, deviceName, iat, deviceId, ...rest}: UserDevice): findAllForOutputType {
//         return {
//             ip,
//             title: deviceName,
//             lastActiveDate: iat,
//             deviceId
//         }
//     }
// }