import mongoose, {HydratedDocument} from "mongoose";
import {RevokedTokenDbType} from "../db-types/refreshToken-db-types";

export type RevokedTokenDocument = HydratedDocument<RevokedTokenDbType>

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