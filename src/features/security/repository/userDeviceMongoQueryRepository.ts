import {db} from "../../../db/mongo-db";
import {UserDeviceDBType} from "../../../db/db-types/user-devices-db-types";
import {WithId} from "mongodb";

export const userDeviceMongoQueryRepository = {
    async findAllForOutput(userId: string) {
        const userSessions: WithId<UserDeviceDBType>[] = await db.getCollections().userDeviceCollection.find({
            userId: userId
        }).toArray()
        console.log(userSessions)
        return userSessions.map((session: WithId<UserDeviceDBType>) => this.mapToOutput(session))
    },
    mapToOutput({ip, deviceName, iat, deviceId, ...rest}: WithId<UserDeviceDBType>) {
        return {
            ip,
            title: deviceName,
            lastActiveDate: iat,
            deviceId
        }
    }
}