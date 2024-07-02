import {ObjectId, WithId} from "mongodb";
import mongoose, {HydratedDocument} from "mongoose";

export type RevokedTokenDbType = {
    token: string;
    userId: ObjectId;
}

export type RevokedTokenDocument = HydratedDocument<WithId<RevokedTokenDbType>>

const revokedTokenSchema = new mongoose.Schema<RevokedTokenDbType>(
    {
        token: {
            type: String,
            maxLength: 300,
            required: true
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            required: true
        }
    }
)

export const RevokedTokenModel = mongoose.model<RevokedTokenDbType>('RevokedToken', revokedTokenSchema)