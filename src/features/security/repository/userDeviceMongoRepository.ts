import {UserDeviceDBType} from "../../../db/db-types/user-devices-db-types";
import {db} from "../../../db/mongo-driver-db-connection";
import {DeleteResult, InsertOneResult, UpdateResult} from "mongodb";
import {
    deleteAllOtherByDeviceIdAndUserIdInputType,
    deleteOneByDeviceIdAndIAtInputType,
    deleteOneByDeviceIdAndUserIdInputType,
    findOneByDeviceIdAndIatInputType,
    UpdateInputType
} from "../../auth/types/inputTypes/userDeviceInputMongoRepositoryTypes";

export const userDeviceMongoRepository = {
    async create(userSession: UserDeviceDBType): Promise<string> {
        const insertedInfo: InsertOneResult<UserDeviceDBType> = await db.getCollections().userDeviceCollection.insertOne(userSession)
        return insertedInfo.insertedId.toString()
    },
    async update({deviceId, iat}: UpdateInputType): Promise<boolean> {
        const updatedInfo: UpdateResult<UserDeviceDBType> = await db.getCollections().userDeviceCollection.updateOne({
                deviceId: deviceId,
            },
            {
                $set: {iat: iat}
            })

        return updatedInfo.matchedCount === 1
    },
    async deleteAllOtherByDeviceIdAndUserId({
                                                deviceId,
                                                userId
                                            }: deleteAllOtherByDeviceIdAndUserIdInputType): Promise<void> {
        await db.getCollections().userDeviceCollection.deleteMany({
            deviceId: {$ne: deviceId},
            userId: {$eq: userId}
        });
    },
    async deleteOneByDeviceIdAndUserId({deviceId, userId}: deleteOneByDeviceIdAndUserIdInputType): Promise<boolean> {
        const deletedInfo: DeleteResult = await db.getCollections().userDeviceCollection.deleteOne({
            deviceId: {$eq: deviceId},
            userId: {$eq: userId}
        })

        return deletedInfo.deletedCount === 1
    },
    async deleteOneByDeviceIdAndIAt({deviceId, iat}: deleteOneByDeviceIdAndIAtInputType): Promise<boolean> {
        const deletedInfo: DeleteResult = await db.getCollections().userDeviceCollection.deleteOne({
            deviceId: {$eq: deviceId},
            iat: {$eq: iat}
        })

        return deletedInfo.deletedCount === 1
    },
    async findByDeviceId(deviceId: string): Promise<UserDeviceDBType | null> {
        return db.getCollections().userDeviceCollection.findOne({deviceId})
    },
    async findOneByDeviceIdAndIat({deviceId, iat}: findOneByDeviceIdAndIatInputType) {
        return await db.getCollections().userDeviceCollection.findOne({
            deviceId,
            iat
        })
    }
}