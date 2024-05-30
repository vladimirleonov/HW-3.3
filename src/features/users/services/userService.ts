import {userMongoRepository} from "../repository/userMongoRepository";
import {UserDbType} from "../../../db/db-types/user-db-types";
import bcrypt from 'bcrypt'
import {InputUserType} from "../input-output-types/user-types";
import {ObjectId} from "mongodb";
import {ErrorsMessagesType} from "../../../common/types/errorsMessages";
import {generateErrorsMessages} from "../../../common/helpers/generateErrorMessages";

export const userService = {
    async createUser (input: InputUserType): Promise<{id?: string, error?: ErrorsMessagesType}> {

        const { login, email, password } = input;

        const [foundUserByLogin, foundUserByEmail]: [UserDbType | null, UserDbType | null] = await Promise.all([
            userMongoRepository.findUserByField('login', login),
            userMongoRepository.findUserByField('email', email)
        ])

        if (foundUserByLogin) {
            return {error: generateErrorsMessages('login', 'login should be unique')}
        }

        if (foundUserByEmail) {
            return {error: generateErrorsMessages('email', 'email should be unique')}
        }

        const saltRounds: number = 10
        const hash: string = await bcrypt.hash(password, saltRounds)

        const newUser: UserDbType = {
            _id: new ObjectId(),
            login: login,
            password: hash,
            email: email,
            createdAt: new Date().toISOString()
        }
        const userId: string = await userMongoRepository.create(newUser)
        return {id: userId}
    },
    deleteUser (id: string): Promise<boolean> {
        return userMongoRepository.delete(id)
    }
}