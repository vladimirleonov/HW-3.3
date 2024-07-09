import {ObjectId} from "mongodb";
import {HydratedDocument} from "mongoose";

// export type RevokedTokenDbType = WithId<{
//     token: string;
//     userId: ObjectId;
// }>

export class RevokedToken {
    constructor(
        public token: string,
        public userId: ObjectId
    ) {}
}

export type RevokedTokenDocument = HydratedDocument<RevokedToken>