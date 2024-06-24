import {db} from "../../../db/mongo-db";
import {InsertOneResult, ObjectId} from "mongodb";
import {RevokedTokenDbType} from "../../../db/db-types/refreshToken-db-types";

export const revokedTokenMongoRepository = {
    async create(token: string, userId: string): Promise<string> {
        const insertedInfo: InsertOneResult<RevokedTokenDbType> = await db.getCollections().revokedTokenCollection.insertOne({
            userId: new ObjectId(userId),
            token: token,
        })
        return insertedInfo.insertedId.toString()
    },
    async findByToken(token: string): Promise<RevokedTokenDbType | null> {
        return db.getCollections().revokedTokenCollection.findOne({token})
    }
}