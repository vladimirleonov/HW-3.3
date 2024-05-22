import {UserDbType} from "../../../db/db-types/user-db-types";
import {userCollection} from "../../../db/mongo-db";

export const userMongoRepository = {
    async create(newUser: UserDbType): Promise<string> {
        const insertedInfo = await userCollection.insertOne(newUser)
        console.log(insertedInfo)
        return insertedInfo.insertedId.toString()
    }
}