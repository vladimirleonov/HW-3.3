import {InsertOneResult, ObjectId} from "mongodb";
import {
    RevokedTokenDbType,
    RevokedTokenDocument,
    RevokedTokenModel
} from "../../../db/models/refreshToken.model";

export const revokedTokenMongoRepository = {
    async(newRevokedToken: RevokedTokenDocument): Promise<RevokedTokenDocument> {
      return newRevokedToken.save()
    },
    // async create(token: string, userId: string): Promise<string> {
    //     const insertedInfo: InsertOneResult<RevokedTokenDbType> = await RevokedTokenModel.insertOne({
    //         userId: new ObjectId(userId),
    //         token: token,
    //     })
    //     return insertedInfo.insertedId.toString()
    // },
    async findByToken(token: string): Promise<RevokedTokenDbType | null> {
        return RevokedTokenModel.findOne({token}).lean()
    }
}