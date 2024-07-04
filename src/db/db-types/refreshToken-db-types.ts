import {ObjectId, WithId} from "mongodb";
import {HydratedDocument} from "mongoose";

export type RevokedTokenDbType = WithId<{
    token: string;
    userId: ObjectId;
}>

export type RevokedTokenDocument = HydratedDocument<RevokedTokenDbType>