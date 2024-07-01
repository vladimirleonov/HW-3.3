import {UserDbType} from "../../../db/db-types/user-db-types"
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb"
import {db} from "../../../db/mongoose-db-connection"
import {DeepPartial} from "../../../common/types/deepPartial";

export const userMongoRepository = {
    async findUserById(id: string): Promise<UserDbType | null> {
        return await UserModel.findOne({_id: new ObjectId(id)})
    },
    async findUserByField(field: string, value: string): Promise<UserDbType | null> {
        return await UserModel.findOne({[field]: value})
    },
    async findUserByConfirmationCode(confirmationCode: string): Promise<UserDbType | null> {
        return await UserModel.findOne({['emailConfirmation.confirmationCode']: confirmationCode})
    },
    async findUserByEmail(email: string): Promise<UserDbType | null> {
        return await UserModel.findOne({email: email})
    },
    findUserByLogin(login: string): Promise<UserDbType | null> {
        return UserModel.findOne({login: login})
    },
    findUserByLoginOrEmailField(loginOrEmail: string): Promise<UserDbType | null> {
        return UserModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    },
    async create(newUser: UserDbType): Promise<string> {
        const insertedInfo: InsertOneResult<UserDbType> = await UserModel.insertOne(newUser)
        return insertedInfo.insertedId.toString()
    },
    async updateIsConfirmed(id: string, isConfirmed: boolean): Promise<boolean> {
        const updatedInfo: UpdateResult<UserDbType> = await UserModel.updateOne(
            {_id: new ObjectId(id)},
            {$set: {['emailConfirmation.isConfirmed']: isConfirmed}},
        )
        return updatedInfo.matchedCount === 1
    },
    async updateConfirmationInfo(id: string, confirmationCode: string, expirationDate: string): Promise<boolean> {
        const updatedInfo: UpdateResult<UserDbType> = await UserModel.updateOne(
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
    async delete(id: string): Promise<boolean> {
        const deletedInfo: DeleteResult = await UserModel.deleteOne({_id: new ObjectId(id)})
        return deletedInfo.deletedCount === 1
    }
}