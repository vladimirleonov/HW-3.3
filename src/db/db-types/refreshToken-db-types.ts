import {ObjectId, WithId} from "mongodb";

export type RevokedTokenDbType = WithId<{
    token: string;
    userId: ObjectId;
}>
