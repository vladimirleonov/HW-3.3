import mongoose from "mongoose";
import {RevokedToken} from "../db-types/refreshToken-db-types";

const revokedTokenSchema = new mongoose.Schema<RevokedToken>(
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
    }, { _id: false }
)

export const RevokedTokenModel = mongoose.model<RevokedToken>('RevokedToken', revokedTokenSchema)