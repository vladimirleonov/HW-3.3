import {UserDeviceDBType} from "../../../db/db-types/user-devices-db-types";
import {db} from "../../../db/mongo-db";
import {DeleteResult, InsertOneResult, UpdateResult, WithId} from "mongodb";

export const userDeviceMongoRepository = {
    async create(userSession: UserDeviceDBType): Promise<string> {
        const insertedInfo: InsertOneResult<UserDeviceDBType> = await db.getCollections().userDeviceCollection.insertOne(userSession)
        return insertedInfo.insertedId.toString()
    },
    async updateOne({deviceId, iat}: {deviceId: string, iat: string}): Promise<boolean> {
        const updatedInfo: UpdateResult<UserDeviceDBType> = await db.getCollections().userDeviceCollection.updateOne({
            deviceId: deviceId,
        },
        {
            $set: {
                iat: iat
            }
        })

        return updatedInfo.matchedCount === 1
    },
    async deleteExcludedCurrent({deviceId, userId}: {deviceId: string, userId: string}): Promise<void> {
        await db.getCollections().userDeviceCollection.deleteMany({
            deviceId: { $ne: deviceId },
            userId: { $eq: userId }
        });

        //return true
    },
    async deleteByDeviceIdAndUserId({deviceId, userId}: {deviceId: string, userId: string}) {
        await db.getCollections().userDeviceCollection.deleteOne({
            deviceId: { $eq: deviceId },
            userId: { $eq: userId }
        })
    },
    async deleteByDeviceIdAndIat({deviceId, iat}: {deviceId: string, iat: string}): Promise<boolean> {
        console.log(deviceId, iat)
        const deletedInfo: DeleteResult = await db.getCollections().userDeviceCollection.deleteOne({
            deviceId: { $eq: deviceId },
            iat: { $eq: iat }
        })
        return deletedInfo.deletedCount === 1
    },
    async findOneByDeviceIdAndUserId({deviceId, userId}: {deviceId: string, userId: string}): Promise<WithId<UserDeviceDBType> | null> {
         return await db.getCollections().userDeviceCollection.findOne(
            {
                deviceId,
                userId
            }
        )
    },
    async findOneByDeviceIdAndIat({deviceId, iat}: {deviceId: string, iat: string}) {
        return await db.getCollections().userDeviceCollection.findOne({
            deviceId,
            iat
        })
    }
}
