import {UserModel} from "../../../db/models/user.model"
import {DeleteResult, ObjectId, UpdateResult, WithId} from "mongodb"
import {UserDbType, UserDocument} from "../../../db/db-types/user-db-types";

export const userMongoRepository = {
    async save(user: UserDocument): Promise<UserDocument> {
        return user.save()
    },
    async findUserById(id: string): Promise<UserDocument | null> {
        return UserModel.findOne({_id: new ObjectId(id)})
    },
    async findUserByField(field: string, value: string): Promise<WithId<UserDbType> | null> {
        return UserModel.findOne({[field]: value}).lean()
    },
    async findUserByConfirmationCode(confirmationCode: string): Promise<WithId<UserDbType> | null> {
        return UserModel.findOne({['emailConfirmation.confirmationCode']: confirmationCode}).lean()
    },
    async findUserByRecoveryCode(recoveryCode: string): Promise<UserDocument | null> {
        return UserModel.findOne({['passwordRecovery.recoveryCode']: recoveryCode})
    },
    async findUserByEmail(email: string): Promise<WithId<UserDbType> | null> {
        return UserModel.findOne({email: email}).lean()
    },
    async findUserByLogin(login: string): Promise<WithId<UserDbType> | null> {
        return UserModel.findOne({login: login}).lean()
    },
    async findUserByLoginOrEmailField(loginOrEmail: string): Promise<WithId<UserDbType> | null> {
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
        console.log(id)
        const updatedInfo: UpdateResult<WithId<UserDbType>> = await UserModel.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    ['passwordRecovery.recoveryCode']: confirmationCode,
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