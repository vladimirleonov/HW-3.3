import {UserDeviceDBType} from "../../../db/db-types/user-devices-db-types";
import {db} from "../../../db/mongo-db";
import {DeleteResult, InsertOneResult, WithId} from "mongodb";

export const userDeviceMongoRepository = {
    async create(userSession: UserDeviceDBType): Promise<string> {
        const insertedInfo: InsertOneResult<UserDeviceDBType> = await db.getCollections().userDeviceCollection.insertOne(userSession)
        return insertedInfo.insertedId.toString()
    },
    async deleteExcludedCurrent({deviceId, userId}: {deviceId: string, userId: string}): Promise<void> {
        await db.getCollections().userDeviceCollection.deleteMany({
            deviceId: { $ne: deviceId },
            userId: { $eq: userId }
        });

        //return true
    },
    async deleteDevice({deviceId, userId}: {deviceId: string, userId: string}) {
        await db.getCollections().userDeviceCollection.deleteMany({
            deviceId: { $eq: deviceId },
            userId: { $eq: userId }
        })
    },
    async findOne({deviceId, userId}: {deviceId: string, userId: string}): Promise<WithId<UserDeviceDBType> | null> {
         return await db.getCollections().userDeviceCollection.findOne(
            {
                deviceId,
                userId
            }
        )
    }
}
