import {
    RevokedTokenModel
} from "../../../db/models/refreshToken.model"
import {RevokedTokenDbType, RevokedTokenDocument} from "../../../db/db-types/refreshToken-db-types";

class RevokedTokenMongoRepository {
    async(newRevokedToken: RevokedTokenDocument): Promise<RevokedTokenDocument> {
      return newRevokedToken.save()
    }
    // async findByToken(token: string): Promise<RevokedTokenDbType | null> {
    //     return RevokedTokenModel.findOne({token})
    // }
}

export const revokedTokenMongoRepository: RevokedTokenMongoRepository = new RevokedTokenMongoRepository()


// export const revokedTokenMongoRepository = {
//     async(newRevokedToken: RevokedTokenDocument): Promise<RevokedTokenDocument> {
//         return newRevokedToken.save()
//     },
//     // async findByToken(token: string): Promise<RevokedTokenDbType | null> {
//     //     return RevokedTokenModel.findOne({token})
//     // }
// }