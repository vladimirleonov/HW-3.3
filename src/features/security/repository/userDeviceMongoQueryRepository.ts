import {db} from "../../../db/mongo-driver-db-connection";
import {UserDeviceDBType} from "../../../db/db-types/user-devices-db-types";
import {findAllForOutputType} from "../../auth/types/outputTypes/userDeviceOutputMongoQueryRepositoryTypes";

export const userDeviceMongoQueryRepository = {
    async findAllForOutput(userId: string): Promise<findAllForOutputType[]> {
        const userSessions: UserDeviceDBType[] = await db.getCollections().userDeviceCollection.find({
            userId: userId
        }).toArray()

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