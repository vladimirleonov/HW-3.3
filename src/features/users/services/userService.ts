import {userMongoRepository} from "../repository/userMongoRepository"
import {UserDbType, UserDocument, UserModel} from "../../../db/models/user.model"
import {UserBodyInputType} from "../input-output-types/user-types"
import {WithId} from "mongodb"
import {cryptoAdapter} from "../../../common/adapters/crypto.adapter"
import {Result, ResultStatus} from "../../../common/types/result"
import {randomUUID} from "node:crypto"
import {add} from "date-fns"

export const userService = {
    async createUser(input: UserBodyInputType): Promise<Result<string | null>> {

        const {login, email, password}: UserBodyInputType = input

        const [foundUserByLogin, foundUserByEmail]: [WithId<UserDbType> | null, WithId<UserDbType> | null] = await Promise.all([
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
            //return {error: generateErrorsMessages('email', 'email should be unique')}
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'email should be unique'}],
                data: null
            }
        }

        const saltRounds: number = 10
        const hash: string = await cryptoAdapter.createHash(password, saltRounds)

        const newUser: UserDocument = new UserModel({
            //_id: new ObjectId(),
            login: login,
            password: hash,
            email: email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {}).toISOString(),
                isConfirmed: true
            }
        })

        const createdUser: UserDocument = await userMongoRepository.save(newUser)
        //const userId: string = await userMongoRepository.create(newUser)

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