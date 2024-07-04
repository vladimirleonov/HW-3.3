import {UserDeviceModel} from "../../../db/models/devices.model"
import {findAllForOutputType} from "../../auth/types/outputTypes/userDeviceOutputMongoQueryRepositoryTypes"
import {UserDeviceDBType} from "../../../db/db-types/user-devices-db-types";

export const userDeviceMongoQueryRepository = {
    async findAllForOutput(userId: string): Promise<findAllForOutputType[]> {
        const userSessions: UserDeviceDBType[] = await UserDeviceModel.find({
            userId: userId
        })

        return userSessions.map((session: UserDeviceDBType) => this.mapToOutput(session))
    },
    mapToOutput({ip, deviceName, iat, deviceId, ...rest}: UserDeviceDBType): findAllForOutputType {
        return {
            ip,
            title: deviceName,
            lastActiveDate: iat,
            deviceId
        }
    }
}