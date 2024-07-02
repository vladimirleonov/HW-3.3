import {UserDeviceDBType, UserDeviceDocument, UserDeviceModel} from "../../../db/models/devices.model";
import {DeleteResult, UpdateResult, WithId} from "mongodb";
import {
    deleteAllOtherByDeviceIdAndUserIdInputType,
    deleteOneByDeviceIdAndIAtInputType,
    deleteOneByDeviceIdAndUserIdInputType,
    findOneByDeviceIdAndIatInputType,
    UpdateInputType
} from "../../auth/types/inputTypes/userDeviceInputMongoRepositoryTypes";

export const userDeviceMongoRepository = {
    async save(userDevice: UserDeviceDocument): Promise<UserDeviceDocument> {
        return userDevice.save()
    },
    // async create(userSession: WithId<UserDeviceDBType>): Promise<string> {
    //     const insertedInfo: InsertOneResult<WithId<UserDeviceDBType>> = await UserDeviceModel.insertOne(userSession)
    //     return insertedInfo.insertedId.toString()
    // },
    async update({deviceId, iat}: UpdateInputType): Promise<boolean> {
        const updatedInfo: UpdateResult<WithId<UserDeviceDBType>> = await UserDeviceModel.updateOne({
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
        await UserDeviceModel.deleteMany({
            deviceId: {$ne: deviceId},
            userId: {$eq: userId}
        });
    },
    async deleteOneByDeviceIdAndUserId({deviceId, userId}: deleteOneByDeviceIdAndUserIdInputType): Promise<boolean> {
        const deletedInfo: DeleteResult = await UserDeviceModel.deleteOne({
            deviceId: {$eq: deviceId},
            userId: {$eq: userId}
        })

        return deletedInfo.deletedCount === 1
    },
    async deleteOneByDeviceIdAndIAt({deviceId, iat}: deleteOneByDeviceIdAndIAtInputType): Promise<boolean> {
        const deletedInfo: DeleteResult = await UserDeviceModel.deleteOne({
            deviceId: {$eq: deviceId},
            iat: {$eq: iat}
        })

        return deletedInfo.deletedCount === 1
    },
    async findByDeviceId(deviceId: string): Promise<WithId<UserDeviceDBType> | null> {
        return UserDeviceModel.findOne({deviceId}).lean()
    },
    async findOneByDeviceIdAndIat({deviceId, iat}: findOneByDeviceIdAndIatInputType): Promise<WithId<UserDeviceDBType> | null> {
        return await UserDeviceModel.findOne({
            deviceId,
            iat
        }).lean()
    }
}




// export const userDeviceMongoRepository = {
//     async create(userSession: WithId<UserDeviceDBType>): Promise<string> {
//         const insertedInfo: InsertOneResult<WithId<UserDeviceDBType>> = await UserDeviceModel.insertOne(userSession)
//         return insertedInfo.insertedId.toString()
//     },
//     async update({deviceId, iat}: UpdateInputType): Promise<boolean> {
//         const updatedInfo: UpdateResult<WithId<UserDeviceDBType>> = await UserDeviceModel.updateOne({
//                 deviceId: deviceId,
//             },
//             {
//                 $set: {iat: iat}
//             })

//         return updatedInfo.matchedCount === 1
//     },
//     async deleteAllOtherByDeviceIdAndUserId({
//                                                 deviceId,
//                                                 userId
//                                             }: deleteAllOtherByDeviceIdAndUserIdInputType): Promise<void> {
//         await UserDeviceModel.deleteMany({
//             deviceId: {$ne: deviceId},
//             userId: {$eq: userId}
//         });
//     },
//     async deleteOneByDeviceIdAndUserId({deviceId, userId}: deleteOneByDeviceIdAndUserIdInputType): Promise<boolean> {
//         const deletedInfo: DeleteResult = await UserDeviceModel.deleteOne({
//             deviceId: {$eq: deviceId},
//             userId: {$eq: userId}
//         })

//         return deletedInfo.deletedCount === 1
//     },
//     async deleteOneByDeviceIdAndIAt({deviceId, iat}: deleteOneByDeviceIdAndIAtInputType): Promise<boolean> {
//         const deletedInfo: DeleteResult = await UserDeviceModel.deleteOne({
//             deviceId: {$eq: deviceId},
//             iat: {$eq: iat}
//         })

//         return deletedInfo.deletedCount === 1
//     },
//     async findByDeviceId(deviceId: string): Promise<WithId<UserDeviceDBType> | null> {
//         return UserDeviceModel.findOne({deviceId})
//     },
//     async findOneByDeviceIdAndIat({deviceId, iat}: findOneByDeviceIdAndIatInputType) {
//         return await UserDeviceModel.findOne({
//             deviceId,
//             iat
//         })
//     }
// }