import {userMongoRepository} from "../repository/userMongoRepository";
import {UserDbType} from "../../../db/db-types/user-db-types";
import bcrypt from 'bcrypt'
import {InputUserType} from "../input-output-types/user-types";
import {ObjectId} from "mongodb";

export const userService = {
    async createUser (input: InputUserType): Promise<string> {
        const password: string = input.password
        const saltRounds: number = 10

        const hash: string = await bcrypt.hash(password, saltRounds)

        const newUser: UserDbType = {
            _id: new ObjectId(),
            login: input.login,
            password: hash,
            email: input.email,
            createdAt: new Date().toISOString()
        }
        return userMongoRepository.create(newUser)
    },
    deleteUser () {
        console.log("deleteUser service")
    }
}