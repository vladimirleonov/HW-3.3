import {ObjectId} from "mongodb";
import mongoose, {HydratedDocument} from "mongoose";

export type RevokedTokenDbType = {
    token: string;
    userId: ObjectId;
}

export type RevokedTokenDocument = HydratedDocument<RevokedTokenDbType>

const revokedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        maxLength: 300,
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    }
})

export const RevokedTokenModel = mongoose.model('RevokedToken', revokedTokenSchema)