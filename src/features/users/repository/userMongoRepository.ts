import {UserDbType, UserDocument, UserModel} from "../../../db/models/user.model"
import {DeleteResult, ObjectId, UpdateResult, WithId} from "mongodb"

export const userMongoRepository = {
    async save(user: UserDocument): Promise<UserDocument> {
        return user.save()
    },
    async findUserById(id: string): Promise<WithId<UserDbType> | null> {
        return await UserModel.findOne({_id: new ObjectId(id)}).lean()
    },
    async findUserByField(field: string, value: string): Promise<WithId<UserDbType> | null> {
        return await UserModel.findOne({[field]: value}).lean()
    },
    async findUserByConfirmationCode(confirmationCode: string): Promise<WithId<UserDbType> | null> {
        return await UserModel.findOne({['emailConfirmation.confirmationCode']: confirmationCode}).lean()
    },
    async findUserByEmail(email: string): Promise<WithId<UserDbType> | null> {
        return await UserModel.findOne({email: email}).lean()
    },
    findUserByLogin(login: string): Promise<WithId<UserDbType> | null> {
        return UserModel.findOne({login: login}).lean()
    },
    findUserByLoginOrEmailField(loginOrEmail: string): Promise<WithId<UserDbType> | null> {
        return UserModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}).lean()
    },
    // async create(newUser: WithId<UserDbType>): Promise<string> {
    //     const insertedInfo: InsertOneResult<WithId<UserDbType>> = await UserModel.insertOne(newUser)
    //     return insertedInfo.insertedId.toString()
    // },
    async updateIsConfirmed(id: string, isConfirmed: boolean): Promise<boolean> {
        const updatedInfo: UpdateResult<WithId<UserDbType>> = await UserModel.updateOne(
            {_id: new ObjectId(id)},
            {$set: {['emailConfirmation.isConfirmed']: isConfirmed}},
        )
        return updatedInfo.matchedCount === 1
    },
    async updateEmailConfirmationInfo(id: string, confirmationCode: string, expirationDate: string): Promise<boolean> {
        const updatedInfo: UpdateResult<WithId<UserDbType>> = await UserModel.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    ['emailConfirmation.confirmationCode']: confirmationCode,
                    ['emailConfirmation.expirationDate']: expirationDate
                }
            }
        )
        return updatedInfo.matchedCount === 1
    },
    async updatePasswordRecoveryInfo(id: string, confirmationCode: string, expirationDate: string): Promise<boolean> {
        const updatedInfo: UpdateResult<WithId<UserDbType>> = await UserModel.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    ['passwordRecovery.confirmationCode']: confirmationCode,
                    ['passwordRecovery.expirationDate']: expirationDate
                }
            }
        )
        return updatedInfo.matchedCount === 1
    },
    async delete(id: string): Promise<boolean> {
        const deletedInfo: DeleteResult = await UserModel.deleteOne({_id: new ObjectId(id)})
        return deletedInfo.deletedCount === 1
    }
}