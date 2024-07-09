import {
    RevokedTokenModel
} from "../../../db/models/revokedToken.model"
import {RevokedTokenDocument} from "../../../db/db-types/revokedToken-db-types";

export class RevokedTokenMongoRepository {
    async(newRevokedToken: RevokedTokenDocument): Promise<RevokedTokenDocument> {
      return newRevokedToken.save()
    }
    // async findByToken(token: string): Promise<RevokedTokenDbType | null> {
    //     return RevokedTokenModel.findOne({token})
    // }
}

// export const revokedTokenMongoRepository: RevokedTokenMongoRepository = new RevokedTokenMongoRepository()


// export const revokedTokenMongoRepository = {
//     async(newRevokedToken: RevokedTokenDocument): Promise<RevokedTokenDocument> {
//         return newRevokedToken.save()
//     },
//     // async findByToken(token: string): Promise<RevokedTokenDbType | null> {
//     //     return RevokedTokenModel.findOne({token})
//     // }
// }