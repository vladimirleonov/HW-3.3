import { WithId } from "mongodb"
import {UserDeviceModel} from "../../../db/models/devices.model"
import {findAllForOutputType} from "../../auth/types/outputTypes/userDeviceOutputMongoQueryRepositoryTypes"
import {UserDeviceDBType} from "../../../db/db-types/user-devices-db-types";

export const userDeviceMongoQueryRepository = {
    async findAllForOutput(userId: string): Promise<findAllForOutputType[]> {
        const userSessions: WithId<UserDeviceDBType>[] = await UserDeviceModel.find({
            userId: userId
        }).lean().exec()

        return userSessions.map((session: WithId<UserDeviceDBType>) => this.mapToOutput(session))
    },
    mapToOutput({ip, deviceName, iat, deviceId, ...rest}: WithId<UserDeviceDBType>): findAllForOutputType {
        return {
            ip,
            title: deviceName,
            lastActiveDate: iat,
            deviceId
        }
    }
}