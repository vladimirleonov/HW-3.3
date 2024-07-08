import {userMongoRepository} from "../repository/userMongoRepository"
import {UserModel} from "../../../db/models/user.model"
import {UserBodyInputType} from "../input-output-types/user-types"
import {ObjectId, WithId} from "mongodb"
import {cryptoAdapter} from "../../../common/adapters/crypto.adapter"
import {Result, ResultStatus} from "../../../common/types/result"
import {randomUUID} from "node:crypto"
import {add} from "date-fns"
import {EmailConfirmation, PasswordRecovery, User, UserDocument} from "../../../db/db-types/user-db-types";

export const userService = {
    async createUser(input: UserBodyInputType): Promise<Result<string | null>> {

        const {login, email, password}: UserBodyInputType = input

        const [foundUserByLogin, foundUserByEmail]: [WithId<User> | null, WithId<User> | null] = await Promise.all([
            userMongoRepository.findUserByField('login', login),
            userMongoRepository.findUserByField('email', email)
        ])

        if (foundUserByLogin) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login', message: 'login should be unique'}],
                data: null
            }
        }

        if (foundUserByEmail) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'email should be unique'}],
                data: null
            }
        }

        const saltRounds: number = 10
        const hash: string = await cryptoAdapter.createHash(password, saltRounds)

        const userData: User = new User(
            new ObjectId(),
            login,
            hash,
            email,
            new Date().toISOString(),
            new EmailConfirmation (
                randomUUID(),
                add(new Date(), {}).toISOString(),
                false
            ),
            new PasswordRecovery(
                '',
                ''
            )
        )

        const userDocument: UserDocument = new UserModel(userData)
        const createdUser: UserDocument = await userMongoRepository.save(userDocument)

        return {
            status: ResultStatus.Success,
            data: createdUser._id.toString()
        }
    },
    async deleteUser(id: string): Promise<Result<boolean>> {
        const isDeleted: boolean = await userMongoRepository.delete(id)
        if (isDeleted) {
            return {
                status: ResultStatus.Success,
                data: true
            }
        } else {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'id', message: `User with id ${id} does not exist`}],
                data: false
            }
        }
    }
}