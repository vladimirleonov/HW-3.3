import {UserDbType} from "../../../db/db-types/user-db-types";
import {DeleteResult, InsertOneResult, ObjectId} from "mongodb";
import {db} from "../../../db/mongo-db";

export const userMongoRepository = {
    async findUserByField(field: string, value: string) {
        return await db.getCollections().userCollection.findOne({[field]: value})
    },
    async create(newUser: UserDbType): Promise<string> {
        const insertedInfo: InsertOneResult<UserDbType> = await db.getCollections().userCollection.insertOne(newUser)
        return insertedInfo.insertedId.toString()
    },
    async delete(id: string): Promise<boolean> {
        const deletedInfo: DeleteResult = await db.getCollections().userCollection.deleteOne({_id: new ObjectId(id)})
        console.log(deletedInfo)
        return deletedInfo.deletedCount === 1
    }
}