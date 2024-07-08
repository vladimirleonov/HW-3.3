import {UserModel} from "../../../db/models/user.model"
import {DeleteResult, ObjectId, UpdateResult} from "mongodb"
import {PasswordRecovery, User, UserDocument} from "../../../db/db-types/user-db-types";

class UserMongoRepository {
    async save(user: UserDocument): Promise<UserDocument> {
        return user.save()
    }
    async findUserById(id: string): Promise<UserDocument | null> {
        return UserModel.findOne({_id: new ObjectId(id)})
    }
    async findUserByField(field: string, value: string): Promise<User | null> {
        return UserModel.findOne({[field]: value})
    }
    async findUserByConfirmationCode(confirmationCode: string): Promise<User | null> {
        return UserModel.findOne({['emailConfirmation.confirmationCode']: confirmationCode})
    }
    async findUserByRecoveryCode(recoveryCode: string): Promise<UserDocument | null> {
        return UserModel.findOne({['passwordRecovery.recoveryCode']: recoveryCode})
    }
    async findUserByEmail(email: string): Promise<User | null> {
        return UserModel.findOne({email: email})
    }
    async findUserByLogin(login: string): Promise<User | null> {
        return UserModel.findOne({login: login})
    }
    async findUserByLoginOrEmailField(loginOrEmail: string): Promise<User | null> {
        return UserModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
    }
    async updateIsConfirmed(id: string, isConfirmed: boolean): Promise<boolean> {
        const updatedInfo: UpdateResult<User> = await UserModel.updateOne(
            {_id: new ObjectId(id)},
            {$set: {['emailConfirmation.isConfirmed']: isConfirmed}},
        )
        return updatedInfo.matchedCount === 1
    }
    async updateEmailConfirmationInfo(id: string, confirmationCode: string, expirationDate: string): Promise<boolean> {
        const updatedInfo: UpdateResult<User> = await UserModel.updateOne(
            {_id: new ObjectId(id)},
            {
                $set: {
                    ['emailConfirmation.confirmationCode']: confirmationCode,
                    ['emailConfirmation.expirationDate']: expirationDate
                }
            }
        )
        return updatedInfo.matchedCount === 1
    }
    async updatePasswordRecoveryInfo(userId: string, passwordRecoveryDTO: PasswordRecovery): Promise<boolean> {
        const updatedInfo: UpdateResult<User> = await UserModel.updateOne(
            {_id: new ObjectId(userId)},
            {
                $set: {
                    ['passwordRecovery.recoveryCode']: passwordRecoveryDTO.recoveryCode,
                    ['passwordRecovery.expirationDate']: passwordRecoveryDTO.expirationDate
                }
            }
        )
        return updatedInfo.matchedCount === 1
    }
    async delete(id: string): Promise<boolean> {
        const deletedInfo: DeleteResult = await UserModel.deleteOne({_id: new ObjectId(id)})
        return deletedInfo.deletedCount === 1
    }
}

export const userMongoRepository = new UserMongoRepository()


// export const userMongoRepository = {
//     async save(user: UserDocument): Promise<UserDocument> {
//         return user.save()
//     },
//     async findUserById(id: string): Promise<UserDocument | null> {
//         return UserModel.findOne({_id: new ObjectId(id)})
//     },
//     async findUserByField(field: string, value: string): Promise<User | null> {
//         return UserModel.findOne({[field]: value})
//     },
//     async findUserByConfirmationCode(confirmationCode: string): Promise<User | null> {
//         return UserModel.findOne({['emailConfirmation.confirmationCode']: confirmationCode})
//     },
//     async findUserByRecoveryCode(recoveryCode: string): Promise<UserDocument | null> {
//         return UserModel.findOne({['passwordRecovery.recoveryCode']: recoveryCode})
//     },
//     async findUserByEmail(email: string): Promise<User | null> {
//         return UserModel.findOne({email: email})
//     },
//     async findUserByLogin(login: string): Promise<User | null> {
//         return UserModel.findOne({login: login})
//     },
//     async findUserByLoginOrEmailField(loginOrEmail: string): Promise<User | null> {
//         return UserModel.findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]})
//     },
//     async updateIsConfirmed(id: string, isConfirmed: boolean): Promise<boolean> {
//         const updatedInfo: UpdateResult<User> = await UserModel.updateOne(
//             {_id: new ObjectId(id)},
//             {$set: {['emailConfirmation.isConfirmed']: isConfirmed}},
//         )
//         return updatedInfo.matchedCount === 1
//     },
//     async updateEmailConfirmationInfo(id: string, confirmationCode: string, expirationDate: string): Promise<boolean> {
//         const updatedInfo: UpdateResult<User> = await UserModel.updateOne(
//             {_id: new ObjectId(id)},
//             {
//                 $set: {
//                     ['emailConfirmation.confirmationCode']: confirmationCode,
//                     ['emailConfirmation.expirationDate']: expirationDate
//                 }
//             }
//         )
//         return updatedInfo.matchedCount === 1
//     },
//     async updatePasswordRecoveryInfo(id: string, confirmationCode: string, expirationDate: string): Promise<boolean> {
//         const updatedInfo: UpdateResult<User> = await UserModel.updateOne(
//             {_id: new ObjectId(id)},
//             {
//                 $set: {
//                     ['passwordRecovery.recoveryCode']: confirmationCode,
//                     ['passwordRecovery.expirationDate']: expirationDate
//                 }
//             }
//         )
//         return updatedInfo.matchedCount === 1
//     },
//     async delete(id: string): Promise<boolean> {
//         const deletedInfo: DeleteResult = await UserModel.deleteOne({_id: new ObjectId(id)})
//         return deletedInfo.deletedCount === 1
//     }
// }