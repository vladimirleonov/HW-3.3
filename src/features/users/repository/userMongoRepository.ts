import {UserDbType} from "../../../db/db-types/user-db-types";
import {userCollection} from "../../../db/mongo-db";
import {DeleteResult, InsertOneResult, ObjectId} from "mongodb";

export const userMongoRepository = {
    async findUserByField(field: string, value: string) {
        return await userCollection.findOne({[field]: value})
    },
    async create(newUser: UserDbType): Promise<string> {
        const insertedInfo: InsertOneResult<UserDbType> = await userCollection.insertOne(newUser)
        return insertedInfo.insertedId.toString()
    },
    async delete(id: string): Promise<boolean> {
        const deletedInfo: DeleteResult = await userCollection.deleteOne({_id: new ObjectId(id)})
        console.log(deletedInfo)
        return deletedInfo.deletedCount === 1
    }
}